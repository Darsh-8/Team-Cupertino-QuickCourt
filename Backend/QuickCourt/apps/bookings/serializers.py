from rest_framework import serializers

from apps.facilities.models import BlockedSlot, Schedule
from .models import Booking


class BookingListSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    court_name = serializers.CharField(source="court.name", read_only=True)
    facility_name = serializers.CharField(source="court.facility.name",
                                          read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "user", "user_email", "court", "court_name", "facility_name",
            "date", "start_time", "end_time", "total_price", "status",
            "metadata", "created_at"
        ]
        read_only_fields = ["id", "user", "total_price", "status",
                            "created_at", "user_email", "court_name",
                            "facility_name"]

    def get_user_email(self, obj):
        try:
            return obj.user.email
        except Exception:
            return None


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["court", "date", "start_time", "end_time", "metadata"]

    def validate(self, data):
        court = data.get("court")
        date = data.get("date")
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        if start_time >= end_time:
            raise serializers.ValidationError(
                "start_time must be before end_time")

        # Operating hours check (defensive)
        if start_time < court.operating_start or end_time > court.operating_end:
            raise serializers.ValidationError(
                "Booking times outside court operating hours")

        # Blocked slots
        if BlockedSlot.objects.filter(court=court, date=date).filter(
                start_time__lt=end_time, end_time__gt=start_time).exists():
            raise serializers.ValidationError(
                "Requested slot is blocked for this court")

        # Schedule override unavailable
        if Schedule.objects.filter(court=court, date=date,
                                   is_available=False).filter(
                start_time__lt=end_time, end_time__gt=start_time).exists():
            raise serializers.ValidationError(
                "Requested slot is unavailable as per schedule override")

        return data
