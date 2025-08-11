from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Review(models.Model):
    """
    Reviews left by users for a Facility.
    Supports optional owner response and moderation status.
    """
    RATING_MIN = 1
    RATING_MAX = 5

    facility = models.ForeignKey(
        "facilities.Facility",
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="reviews_made"
    )
    rating = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=255, blank=True)
    comment = models.TextField(blank=True)
    is_published = models.BooleanField(
        default=True)  # admin may unpublish if abusive
    is_verified = models.BooleanField(
        default=False)  # whether user actually booked (populate later)
    owner_response = models.TextField(blank=True)
    owner_responded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optional: helpful_count, reported_count could be added later

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["facility", "rating"]),
            models.Index(fields=["user"]),
        ]

    def save(self, *args, **kwargs):
        # enforce rating bounds
        if not (self.RATING_MIN <= int(self.rating) <= self.RATING_MAX):
            raise ValueError(
                f"rating must be between {self.RATING_MIN} and {self.RATING_MAX}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review {self.id} by {self.user} for Facility {self.facility_id}"
