from rest_framework import serializers

from apps.facilities.models import Court, BlockedSlot, Schedule
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "user", "court", "date", "start_time", "end_time",
                  "total_price", "status", "created_at", "metadata"]
        read_only_fields = ["id", "user", "total_price", "status",
                            "created_at"]

    def validate(self, data):
        """
        Validate times, court exists and that booking falls within court operating hours,
        and not in blocked slots or explicit schedule marked unavailable.
        """
        court: Court = data.get("court")
        date = data.get("date")
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        if start_time >= end_time:
            raise serializers.ValidationError(
                "start_time must be before end_time")

        # Operating hours check
        if start_time < court.operating_start or end_time > court.operating_end:
            raise serializers.ValidationError(
                "Booking time outside court operating hours")

        # Blocked slots conflict
        blocked = BlockedSlot.objects.filter(court=court, date=date).filter(
            start_time__lt=end_time, end_time__gt=start_time
        ).exists()
        if blocked:
            raise serializers.ValidationError(
                "Requested slot is blocked for this court")

        # Schedule override marking unavailable
        schedule_conflict = Schedule.objects.filter(court=court, date=date,
                                                    is_available=False).filter(
            start_time__lt=end_time, end_time__gt=start_time
        ).exists()
        if schedule_conflict:
            raise serializers.ValidationError(
                "Requested slot is unavailable as per schedule override")

        return data

    def create(self, validated_data):
        """
        total_price calculation should consider DynamicPricing if available,
        otherwise use court.price_per_hour * hours (simple calculation).
        The actual booking creation with conflict prevention is handled in the view
        inside a DB transaction to use select_for_update.
        """
        # NOTE: we won't create here in serializer for concurrency safety.
        raise NotImplementedError(
            "Use the BookingViewSet.create() method for transactional create")
