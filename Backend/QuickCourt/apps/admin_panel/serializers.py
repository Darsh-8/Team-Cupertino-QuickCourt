from rest_framework import serializers

from apps.accounts.models import User
from apps.facilities.models import Facility
from .models import AdminAction, Report


class AdminActionSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source="admin.email", read_only=True)

    class Meta:
        model = AdminAction
        fields = "__all__"
        read_only_fields = ("admin", "created_at")


class FacilityApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ("id", "name", "status")


class UserBanSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "status")


class ReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.EmailField(source="reporter.email",
                                            read_only=True)

    class Meta:
        model = Report
        fields = "__all__"
