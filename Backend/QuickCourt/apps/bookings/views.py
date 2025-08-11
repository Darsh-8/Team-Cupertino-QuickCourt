from datetime import timedelta, datetime

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Court model import for availability endpoint
from apps.facilities.models import Court, BlockedSlot  # adjust path if needed
from .models import Booking
from .permissions import IsBookingOwnerOrAdmin
from .serializers import BookingReadSerializer, BookingCreateSerializer


class BookingViewSet(viewsets.GenericViewSet):
    """
    Handles: list, create, retrieve, cancel
    """
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BookingReadSerializer

    def get_queryset(self):
        # Only return user's bookings unless admin requests
        user = self.request.user
        if getattr(user, "role", None) == "admin" or user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def list(self, request):
        qs = self.get_queryset()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = BookingReadSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BookingReadSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        booking = get_object_or_404(self.get_queryset(), booking_id=pk)
        self.check_object_permissions(request, booking)
        serializer = BookingReadSerializer(booking)
        return Response(serializer.data)

    def create(self, request):
        serializer = BookingCreateSerializer(data=request.data,
                                             context={"request": request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        out_ser = BookingReadSerializer(booking)
        return Response(out_ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="cancel",
            permission_classes=[IsAuthenticated, IsBookingOwnerOrAdmin])
    def cancel(self, request, pk=None):
        booking = get_object_or_404(Booking.objects.all(), booking_id=pk)
        self.check_object_permissions(request, booking)
        if booking.status == "cancelled":
            return Response({"detail": "Already cancelled"},
                            status=status.HTTP_400_BAD_REQUEST)
        booking.status = "cancelled"
        booking.cancelled_at = timezone.now()
        booking.save(update_fields=["status", "cancelled_at"])
        # Optionally: refund flow or create payment reversal
        return Response({"detail": "Booking cancelled"},
                        status=status.HTTP_200_OK)


# Availability helper view: /api/courts/{id}/availability/
from rest_framework.views import APIView


class CourtAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, court_id):
        """
        Query params:
            date=YYYY-MM-DD (required)
            slot_length=minutes (optional, default 60)
        Returns list of available slots (start_time, end_time)
        """
        date_str = request.query_params.get("date")
        slot_length = int(request.query_params.get("slot_length", 60))

        if not date_str:
            return Response(
                {"detail": "date query param required (YYYY-MM-DD)"},
                status=400)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "invalid date format"}, status=400)

        court = get_object_or_404(Court, pk=court_id)

        # build operating window
        open_time = court.operating_start
        close_time = court.operating_end

        # create slot list
        slots = []
        cur_dt = datetime.combine(date_obj, open_time)
        close_dt = datetime.combine(date_obj, close_time)
        delta = timedelta(minutes=slot_length)

        # Preload confirmed bookings & blocked slots
        bookings = Booking.objects.filter(court=court, date=date_obj,
                                          status="confirmed")
        blocked = BlockedSlot.objects.filter(court=court, date=date_obj)

        while cur_dt + delta <= close_dt:
            slot_start = cur_dt.time()
            slot_end = (cur_dt + delta).time()
            # check overlap with confirmed bookings
            overlap_book = bookings.filter(Q(start_time__lt=slot_end) & Q(
                end_time__gt=slot_start)).exists()
            overlap_block = blocked.filter(Q(start_time__lt=slot_end) & Q(
                end_time__gt=slot_start)).exists()
            if not overlap_book and not overlap_block:
                slots.append({"start_time": slot_start.strftime("%H:%M:%S"),
                              "end_time": slot_end.strftime("%H:%M:%S")})
            cur_dt += delta

        return Response({"date": date_obj.isoformat(), "court_id": court_id,
                         "available_slots": slots})
