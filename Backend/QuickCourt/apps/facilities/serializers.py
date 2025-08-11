from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    Facility, Amenity, Court, Schedule, BlockedSlot, DynamicPricing, Report,
    AdminAction
)

User = get_user_model()


# Amenity serializers
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name"]


# Facility serializers
class FacilityListSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.get_full_name",
                                       read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Facility
        fields = ["id", "name", "location", "status", "avg_rating",
                  "owner_name", "amenities"]


class FacilityDetailSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    courts_count = serializers.SerializerMethodField()

    class Meta:
        model = Facility
        fields = [
            "id", "owner", "name", "description", "location",
            "latitude", "longitude", "status", "created_at",
            "amenities", "avg_rating", "courts_count"
        ]

    def get_courts_count(self, obj):
        return obj.courts.count()


class FacilityCreateUpdateSerializer(serializers.ModelSerializer):
    # For writes: accept amenity ids for M2M updates
    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), many=True, write_only=True,
        required=False
    )

    class Meta:
        model = Facility
        fields = [
            "name", "description", "location", "latitude", "longitude",
            "amenity_ids"
        ]

    def create(self, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", [])
        owner = self.context["request"].user
        facility = Facility.objects.create(owner=owner, **validated_data)
        if amenity_ids:
            facility.amenities.set(amenity_ids)
        return facility

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if amenity_ids is not None:
            instance.amenities.set(amenity_ids)
        return instance


# Court serializers
class CourtSerializer(serializers.ModelSerializer):
    facility = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all())
    facility_name = serializers.CharField(source="facility.name",
                                          read_only=True)

    class Meta:
        model = Court
        fields = [
            "id", "facility", "facility_name", "name",
            "sport_type", "price_per_hour", "operating_start", "operating_end",
            "metadata"
        ]


# Schedule & BlockedSlot
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "court", "date", "start_time", "end_time",
                  "is_available"]


class BlockedSlotSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = BlockedSlot
        fields = ["id", "court", "date", "start_time", "end_time", "reason",
                  "created_by", "created_at"]
        read_only_fields = ["created_by", "created_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


# Dynamic pricing
class DynamicPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicPricing
        fields = ["id", "court", "date", "base_price", "adjusted_price",
                  "reason", "created_at", "expires_at"]


# Admin / Report serializers
class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Report
        fields = ["id", "reporter", "target_type", "target_id", "reason",
                  "status", "created_at"]
        read_only_fields = ["reporter", "status", "created_at"]

    def create(self, validated_data):
        validated_data["reporter"] = self.context["request"].user
        return super().create(validated_data)


class AdminActionSerializer(serializers.ModelSerializer):
    admin = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AdminAction
        fields = ["id", "admin", "action_type", "details", "created_at"]
        read_only_fields = ["admin", "created_at"]
