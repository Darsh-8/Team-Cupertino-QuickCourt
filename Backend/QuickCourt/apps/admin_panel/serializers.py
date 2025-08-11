from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.bookings.models import Booking
from apps.facilities.models import Facility, Report, AdminAction

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # include fields you want admins to see; don't expose passwords
        fields = ["id", "email", "name", "role", "status", "created_at"]


class FacilityAdminListSerializer(serializers.ModelSerializer):
    owner_email = serializers.CharField(source="owner.email", read_only=True)

    class Meta:
        model = Facility
        fields = ["id", "name", "location", "status", "owner_email",
                  "created_at", "avg_rating"]


class FacilityAdminDetailSerializer(serializers.ModelSerializer):
    owner = AdminUserSerializer(read_only=True)

    class Meta:
        model = Facility
        fields = "__all__"
        read_only_fields = ["owner", "created_at", "avg_rating"]


class ReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.CharField(source="reporter.email",
                                           read_only=True)

    class Meta:
        model = Report
        fields = ["id", "reporter", "reporter_email", "target_type",
                  "target_id", "reason", "status", "created_at"]


class BookingListSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    facility_name = serializers.CharField(source="court.facility.name",
                                          read_only=True)
    court_name = serializers.CharField(source="court.name", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "user", "user_email", "facility_name", "court_name",
                  "date", "start_time", "end_time", "total_price", "status",
                  "created_at"]


class AdminActionSerializer(serializers.ModelSerializer):
    admin_email = serializers.CharField(source="admin.email", read_only=True)

    class Meta:
        model = AdminAction
        fields = ["id", "admin", "admin_email", "action_type", "details",
                  "created_at"]
