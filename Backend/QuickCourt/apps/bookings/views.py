from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.facilities.models import Court, DynamicPricing
from . import tasks
from .models import Booking
from .permissions import IsBookingOwnerOrAdmin
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    """
    /api/bookings/
    - list: my bookings
    - create: transactional create with conflict checking and post-create tasks
    - retrieve
    - cancel: custom action to cancel booking (permission checked)
    """
    queryset = Booking.objects.select_related("court", "user").all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["date", "created_at"]

    def get_queryset(self):
        # Only return own bookings for non-admins
        user = self.request.user
        qs = super().get_queryset()
        if getattr(user, "role", None) == "admin":
            return qs
        return qs.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Transactional booking creation:
         - lock court row with select_for_update
         - check overlapping bookings
         - compute price (dynamic pricing override if exists)
         - create booking
         - enqueue async tasks (telegram, sheets, ml)
        """
        data = request.data
        user = request.user

        # basic validation via serializer (we won't call serializer.create)
        temp_serializer = BookingSerializer(data=data,
                                            context={"request": request})
        temp_serializer.is_valid(raise_exception=True)
        validated = temp_serializer.validated_data

        court = get_object_or_404(Court, pk=validated["court"].id)
        date = validated["date"]
        start_time = validated["start_time"]
        end_time = validated["end_time"]

        # Use DB transaction and lock the court row
        with transaction.atomic():
            # Lock court to serialize concurrent booking attempts
            court_locked = Court.objects.select_for_update().get(pk=court.pk)

            # Check overlapping confirmed bookings
            overlap_qs = Booking.objects.select_for_update().filter(
                court=court_locked,
                date=date,
                status="confirmed",
                start_time__lt=end_time,
                end_time__gt=start_time,
            )
            if overlap_qs.exists():
                return Response({"detail": "Time slot already booked"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Also re-check blocked slots/schedules server-side (defense in depth)
            from apps.facilities.models import BlockedSlot, Schedule
            blocked = BlockedSlot.objects.filter(court=court_locked,
                                                 date=date).filter(
                start_time__lt=end_time, end_time__gt=start_time
            ).exists()
            if blocked:
                return Response({"detail": "Slot is blocked for the court"},
                                status=status.HTTP_400_BAD_REQUEST)
            schedule_conflict = Schedule.objects.filter(court=court_locked,
                                                        date=date,
                                                        is_available=False).filter(
                start_time__lt=end_time, end_time__gt=start_time
            ).exists()
            if schedule_conflict:
                return Response({"detail": "Slot unavailable per schedule"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Compute price: check active DynamicPricing for court & date; else base price calculation
            dp = DynamicPricing.objects.filter(court=court_locked,
                                               date=date).order_by(
                "-created_at").first()
            if dp and (
                    dp.expires_at is None or dp.expires_at > timezone.now()):
                adjusted_price = dp.adjusted_price
            else:
                # Hours as decimal fraction
                start_dt = timezone.datetime.combine(date, start_time)
                end_dt = timezone.datetime.combine(date, end_time)
                total_seconds = (end_dt - start_dt).total_seconds()
                hours = Decimal(total_seconds) / Decimal(3600)
                adjusted_price = (
                            court_locked.price_per_hour * hours).quantize(
                    Decimal("0.01"))

            booking = Booking.objects.create(
                user=user,
                court=court_locked,
                date=date,
                start_time=start_time,
                end_time=end_time,
                total_price=adjusted_price,
                status="confirmed",
                metadata={"created_via": "api"}
            )

            # Commit transaction here (exit atomic block)

        # Post-create async work (non-blocking)
        try:
            # Telegram alert to owner/admin
            tasks.send_telegram_alert.delay(booking.id,
                                            f"New booking #{booking.id} on {booking.date}")
            # Log to Google Sheets
            tasks.log_booking_to_google_sheets.delay({
                "booking_id": booking.id,
                "user_id": booking.user.id,
                "court_id": booking.court.id,
                "date": str(booking.date),
                "start_time": str(booking.start_time),
                "end_time": str(booking.end_time),
                "total_price": str(booking.total_price),
            })
            # Optional ML hook
            tasks.run_ml_prediction_hook.delay(booking.id)
        except Exception:
            # don't fail creation because tasks couldn't enqueue
            pass

        serializer = BookingSerializer(booking, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="cancel",
            permission_classes=[IsAuthenticated, IsBookingOwnerOrAdmin])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status != "confirmed":
            return Response(
                {"detail": "Only confirmed bookings can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST)
        # business rules: allow cancellation up to X hours before (not enforced here - add as needed)
        booking.status = "cancelled"
        booking.save(update_fields=["status", "updated_at"])
        # notify and log
        try:
            tasks.send_telegram_alert.delay(booking.id,
                                            f"Booking #{booking.id} was cancelled")
            tasks.log_booking_to_google_sheets.delay({
                "booking_id": booking.id,
                "action": "cancel",
                "timestamp": str(timezone.now()),
            })
        except Exception:
            pass
        return Response({"id": booking.id, "status": booking.status})

    @action(detail=False, methods=["get"], url_path="availability",
            permission_classes=[IsAuthenticated])
    def availability(self, request):
        """
        GET /api/bookings/availability/?court=1&date=2025-08-15
        Returns list of free time slots between operating hours in 30-minute buckets by default.
        """
        court_id = request.query_params.get("court")
        date = request.query_params.get("date")
        bucket_minutes = int(request.query_params.get("bucket", 30))
        if not court_id or not date:
            return Response({"detail": "court and date query params required"},
                            status=status.HTTP_400_BAD_REQUEST)
        court = get_object_or_404(Court, pk=court_id)
        from datetime import datetime, timedelta
        # compute buckets
        start_dt = datetime.combine(
            timezone.datetime.strptime(date, "%Y-%m-%d").date(),
            court.operating_start)
        end_dt = datetime.combine(
            timezone.datetime.strptime(date, "%Y-%m-%d").date(),
            court.operating_end)
        delta = timedelta(minutes=bucket_minutes)
        slots = []
        current = start_dt
        while current + delta <= end_dt:
            s = current.time()
            e = (current + delta).time()
            # check blocked, schedule, bookings
            blocked = court.blocked_slots.filter(date=date, start_time__lt=e,
                                                 end_time__gt=s).exists()
            schedule_conflict = court.schedules.filter(date=date,
                                                       is_available=False,
                                                       start_time__lt=e,
                                                       end_time__gt=s).exists()
            booked = court.bookings.filter(date=date, status="confirmed",
                                           start_time__lt=e,
                                           end_time__gt=s).exists()
            slots.append({
                "start_time": str(s),
                "end_time": str(e),
                "free": not (blocked or schedule_conflict or booked)
            })
            current += delta
        return Response({"court": court.id, "date": date, "slots": slots})
