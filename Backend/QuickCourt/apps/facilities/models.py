from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

User = settings.AUTH_USER_MODEL


class Amenity(models.Model):
    """Master list of amenities (e.g., water, parking, showers)."""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Facility(models.Model):
    """A sports venue owned by a user with role 'owner'."""
    STATUS_CHOICES = [("pending", "Pending"), ("approved", "Approved"),
                      ("rejected", "Rejected")]

    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name="facilities")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True,
                                    blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="pending")
    amenities = models.ManyToManyField(Amenity, blank=True,
                                       related_name="facilities")
    created_at = models.DateTimeField(auto_now_add=True)
    avg_rating = models.FloatField(default=0.0)

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["owner"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.location})"


class Court(models.Model):
    """Individual court within a facility."""
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE,
                                 related_name="courts")
    name = models.CharField(max_length=100)
    sport_type = models.CharField(max_length=50)
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2,
                                         validators=[MinValueValidator(0)])
    operating_start = models.TimeField()
    operating_end = models.TimeField()
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("facility", "name")
        indexes = [
            models.Index(fields=["sport_type"]),
            models.Index(fields=["facility"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.sport_type} @ {self.facility.name}"


class Schedule(models.Model):
    """Explicit availability entries for a court."""
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="schedules")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("court", "date", "start_time", "end_time")
        indexes = [models.Index(fields=["court", "date"])]
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.court} - {self.date} {self.start_time}-{self.end_time}"


class BlockedSlot(models.Model):
    """Permanent or one-off block for maintenance/events."""
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="blocked_slots")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reason = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                   blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["court", "date"])]
        unique_together = ("court", "date", "start_time", "end_time")

    def __str__(self):
        return f"Blocked {self.court} on {self.date} {self.start_time}-{self.end_time}"


class DynamicPricing(models.Model):
    """Stores price adjustments for a court."""
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="dynamic_pricings")
    date = models.DateField(null=True, blank=True)
    base_price = models.DecimalField(max_digits=8, decimal_places=2,
                                     validators=[MinValueValidator(0)])
    adjusted_price = models.DecimalField(max_digits=8, decimal_places=2,
                                         validators=[MinValueValidator(0)])
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["court", "date"]),
            models.Index(fields=["expires_at"]),
        ]

    def __str__(self):
        return f"DynamicPrice {self.court} on {self.date or 'rule'}: {self.adjusted_price}"


class Report(models.Model):
    """Reports for moderation."""
    REPORT_TARGET_CHOICES = [("facility", "Facility"), ("user", "User")]
    STATUS_CHOICES = [("open", "Open"), ("resolved", "Resolved")]

    reporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                 related_name="facility_reports_made")
    target_type = models.CharField(max_length=16,
                                   choices=REPORT_TARGET_CHOICES)
    target_id = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="open")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["target_type", "target_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Report [{self.target_type}:{self.target_id}] by {self.reporter}"


class AdminAction(models.Model):
    """Audit log for admin actions."""
    ACTION_TYPES = [
        ('facility_approval', 'Facility Approval'),
        ('facility_rejection', 'Facility Rejection'),
        ('user_ban', 'User Ban'),
        ('user_unban', 'User Unban'),
        ('report_resolution', 'Report Resolution'),
    ]

    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                              related_name="admin_actions")
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action_type} by {self.admin} at {self.created_at}"
