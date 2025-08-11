from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Review

User = get_user_model()


class ReviewListSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id", "facility", "user", "user_name", "rating", "title",
            "comment", "is_published", "is_verified", "owner_response",
            "owner_responded_at", "created_at"
        ]
        read_only_fields = ["id", "user", "user_name", "owner_response",
                            "owner_responded_at", "created_at"]

    def get_user_name(self, obj):
        if obj.user:
            # prefer full name if available
            return getattr(obj.user, "get_full_name",
                           lambda: None)() or getattr(obj.user, "email", None)
        return "Anonymous"


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["facility", "rating", "title", "comment"]

    def validate_rating(self, value):
        if not (Review.RATING_MIN <= value <= Review.RATING_MAX):
            raise serializers.ValidationError(
                f"Rating must be between {Review.RATING_MIN} and {Review.RATING_MAX}")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None
        review = Review.objects.create(user=user, **validated_data)
        return review


class OwnerResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "owner_response", "owner_responded_at"]
        read_only_fields = ["id", "owner_responded_at"]

    def update(self, instance, validated_data):
        instance.owner_response = validated_data.get("owner_response",
                                                     instance.owner_response)
        instance.owner_responded_at = timezone.now()
        instance.save()
        return instance
