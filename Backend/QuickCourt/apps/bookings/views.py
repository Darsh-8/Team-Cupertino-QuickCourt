from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.facilities.models import Court, DynamicPricing, BlockedSlot, Schedule
from . import tasks
from .models import Booking
from .permissions import IsBookingOwnerOrAdmin
from .serializers import BookingListSerializer, BookingCreateSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("court", "user").all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["date", "created_at"]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return BookingCreateSerializer
        return BookingListSerializer

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if getattr(user, "role", None) == "admin":
            return qs
        return qs.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Transactional create:
         - validate via serializer
         - lock court row select_for_update
         - check overlapping confirmed bookings
         - compute price (dynamic pricing override)
         - create booking
         - enqueue async tasks (non-blocking)
        """
        serializer = BookingCreateSerializer(data=request.data,
                                             context={"request": request})
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        court = validated["court"]
        date = validated["date"]
        start_time = validated["start_time"]
        end_time = validated["end_time"]

        with transaction.atomic():
            # Lock court row to serialize concurrent attempts
            court_locked = Court.objects.select_for_update().get(pk=court.pk)

            # Overlap check
            overlap_exists = Booking.objects.select_for_update().filter(
                court=court_locked,
                date=date,
                status="confirmed",
                start_time__lt=end_time,
                end_time__gt=start_time,
            ).exists()
            if overlap_exists:
                return Response({"detail": "Time slot already booked"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Re-check blocked/schedule defensively
            if BlockedSlot.objects.filter(court=court_locked,
                                          date=date).filter(
                    start_time__lt=end_time, end_time__gt=start_time).exists():
                return Response({"detail": "Slot is blocked for the court"},
                                status=status.HTTP_400_BAD_REQUEST)

            if Schedule.objects.filter(court=court_locked, date=date,
                                       is_available=False).filter(
                    start_time__lt=end_time, end_time__gt=start_time).exists():
                return Response({"detail": "Slot unavailable per schedule"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Compute price: prefer active DynamicPricing
            dp = DynamicPricing.objects.filter(court=court_locked,
                                               date=date).order_by(
                "-created_at").first()
            if dp and (getattr(dp, "expires_at",
                               None) is None or dp.expires_at > timezone.now()):
                total_price = dp.adjusted_price
            else:
                # compute hours fraction
                start_dt = timezone.datetime.combine(date, start_time)
                end_dt = timezone.datetime.combine(date, end_time)
                total_seconds = (end_dt - start_dt).total_seconds()
                hours = Decimal(total_seconds) / Decimal(3600)
                total_price = (court_locked.price_per_hour * hours).quantize(
                    Decimal("0.01"))

            booking = Booking.objects.create(
                user=request.user,
                court=court_locked,
                date=date,
                start_time=start_time,
                end_time=end_time,
                total_price=total_price,
                status=Booking.STATUS_CONFIRMED,
                metadata=validated.get("metadata", {"created_via": "api"})
            )

        # post-create async tasks
        try:
            tasks.send_telegram_alert.delay(booking.id,
                                            f"New booking #{booking.id} for court {court_locked.id}")
            tasks.log_booking_to_google_sheets.delay({
                "booking_id": booking.id,
                "user_id": booking.user.id,
                "court_id": booking.court.id,
                "date": str(booking.date),
                "start_time": str(booking.start_time),
                "end_time": str(booking.end_time),
                "total_price": str(booking.total_price),
            })
            tasks.run_ml_prediction_hook.delay(booking.id)
        except Exception:
            # Do not fail creation if task dispatch fails
            pass

        out_serializer = BookingListSerializer(booking,
                                               context={"request": request})
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="cancel",
            permission_classes=[IsAuthenticated, IsBookingOwnerOrAdmin])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status != Booking.STATUS_CONFIRMED:
            return Response(
                {"detail": "Only confirmed bookings can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST)
        # optionally enforce cancellation window here
        booking.status = Booking.STATUS_CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        try:
            tasks.send_telegram_alert.delay(booking.id,
                                            f"Booking #{booking.id} cancelled")
            tasks.log_booking_to_google_sheets.delay(
                {"booking_id": booking.id, "action": "cancel",
                 "timestamp": str(timezone.now())})
        except Exception:
            pass
        return Response({"id": booking.id, "status": booking.status})

    @action(detail=False, methods=["get"], url_path="availability",
            permission_classes=[IsAuthenticated])
    def availability(self, request):
        """
        Query params: ?court=<id>&date=YYYY-MM-DD&bucket=30
        Returns bucketed time slots with free boolean.
        """
        court_id = request.query_params.get("court")
        date = request.query_params.get("date")
        bucket_minutes = int(request.query_params.get("bucket", 30))
        if not court_id or not date:
            return Response({"detail": "court and date required"},
                            status=status.HTTP_400_BAD_REQUEST)

        court = get_object_or_404(Court, pk=court_id)
        from datetime import datetime, timedelta
        # parse date
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        start_dt = datetime.combine(date_obj, court.operating_start)
        end_dt = datetime.combine(date_obj, court.operating_end)
        delta = timedelta(minutes=bucket_minutes)
        slots = []
        current = start_dt
        while current + delta <= end_dt:
            s = current.time()
            e = (current + delta).time()
            blocked = court.blocked_slots.filter(date=date_obj,
                                                 start_time__lt=e,
                                                 end_time__gt=s).exists()
            schedule_conflict = court.schedules.filter(date=date_obj,
                                                       is_available=False,
                                                       start_time__lt=e,
                                                       end_time__gt=s).exists()
            booked = court.bookings.filter(date=date_obj,
                                           status=Booking.STATUS_CONFIRMED,
                                           start_time__lt=e,
                                           end_time__gt=s).exists()
            slots.append({"start_time": str(s), "end_time": str(e),
                          "free": not (
                                      blocked or schedule_conflict or booked)})
            current += delta
        return Response({"court": court.id, "date": date, "slots": slots})
