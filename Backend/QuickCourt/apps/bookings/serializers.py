from decimal import Decimal, ROUND_HALF_UP

from django.utils import timezone
from rest_framework import serializers

from apps.facilities.models import Court  # adjust path as needed
from .models import Booking


class BookingReadSerializer(serializers.ModelSerializer):
    court_name = serializers.CharField(source="court.name", read_only=True)
    facility_id = serializers.IntegerField(source="court.facility_id",
                                           read_only=True)

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "user",
            "court",
            "court_name",
            "facility_id",
            "date",
            "start_time",
            "end_time",
            "total_price",
            "status",
            "created_at",
            "cancelled_at",
        ]
        read_only_fields = ["booking_id", "user", "total_price", "status",
                            "created_at", "cancelled_at", "court_name",
                            "facility_id"]


class BookingCreateSerializer(serializers.Serializer):
    court_id = serializers.IntegerField()
    date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    def validate(self, data):
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError(
                "start_time must be before end_time")
        if data["date"] < timezone.localdate():
            raise serializers.ValidationError("Cannot book for past dates")
        return data

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        # fetch court
        try:
            court = Court.objects.get(pk=validated_data["court_id"])
        except Court.DoesNotExist:
            raise serializers.ValidationError("Court not found")

        # price calculation: default simple calculation using court.price_per_hour
        def price_calculator(court_obj, date, start_time, end_time):
            # calculate hours as fraction
            start_dt = timezone.datetime.combine(date, start_time)
            end_dt = timezone.datetime.combine(date, end_time)
            delta = (end_dt - start_dt).total_seconds() / 3600.0
            # base price per hour (simple). You can plug dynamic pricing service here.
            total = Decimal(delta) * court_obj.price_per_hour
            # round to 2 decimals
            return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        booking = Booking.create_booking_atomic(
            user=request.user,
            court=court,
            date=validated_data["date"],
            start_time=validated_data["start_time"],
            end_time=validated_data["end_time"],
            price_calculator=price_calculator,
        )

        # after create, trigger notification asynchronously (e.g., send confirmation)
        # from .tasks import send_booking_confirmation  # local import to avoid circular
        # send_booking_confirmation.delay(booking.booking_id)

        return booking
