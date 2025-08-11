from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

User = settings.AUTH_USER_MODEL


class Amenity(models.Model):
    """
    Master list of amenities (e.g., water, parking, showers).
    Normalized to allow many-to-many with facilities.
    """
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Facility(models.Model):
    """
    A sports venue. Owned by a user with role 'owner'.
    Status supports approval workflow per SRS.
    """
    STATUS_CHOICES = [("pending", "Pending"), ("approved", "Approved"),
                      ("rejected", "Rejected")]

    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name="facilities")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    location = models.CharField(
        max_length=255)  # structured address can be added later
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True,
                                    blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="pending")
    amenities = models.ManyToManyField(Amenity, blank=True,
                                       related_name="facilities")
    created_at = models.DateTimeField(auto_now_add=True)
    avg_rating = models.FloatField(
        default=0.0)  # denormalized for fast listing; update via signals/cron

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["owner"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.location})"


class Court(models.Model):
    """
    Individual court within a facility. Price is a base price; dynamic pricing table may override.
    operating_start/operating_end are daily open hours; schedules and blocked_slots control real availability.
    """
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE,
                                 related_name="courts")
    name = models.CharField(max_length=100)
    sport_type = models.CharField(
        max_length=50)  # could be normalized later if needed
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2,
                                         validators=[MinValueValidator(0)])
    operating_start = models.TimeField()
    operating_end = models.TimeField()
    metadata = models.JSONField(default=dict,
                                blank=True)  # extra fields: surface type, indoor/outdoor, etc.

    class Meta:
        unique_together = ("facility", "name")
        indexes = [
            models.Index(fields=["sport_type"]),
            models.Index(fields=["facility"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.sport_type} @ {self.facility.name}"


class Schedule(models.Model):
    """
    Explicit availability entries (date-level). This is used for special availability overrides.
    If no specific schedule entry for a date, court is assumed available between operating_start/operating_end.
    """
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="schedules")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(
        default=True)  # false means blocked for that slot
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("court", "date", "start_time", "end_time")
        indexes = [models.Index(fields=["court", "date"])]
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.court} - {self.date} {self.start_time}-{self.end_time}"


class BlockedSlot(models.Model):
    """
    Permanent or one-off block for maintenance, private events etc.
    For recurring blocks extend this model or create a Recurrence model.
    """
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
    """
    Stores price adjustments for a court. Use AI service to populate adjusted_price and reason.
    For a given court + date, multiple adjustments may exist but only latest active one is used.
    """
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="dynamic_pricings")
    date = models.DateField(null=True,
                            blank=True)  # if null, it can be a rule not bound to a date
    base_price = models.DecimalField(max_digits=8, decimal_places=2,
                                     validators=[MinValueValidator(0)])
    adjusted_price = models.DecimalField(max_digits=8, decimal_places=2,
                                         validators=[MinValueValidator(0)])
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["court", "date"]),
                   models.Index(fields=["expires_at"])]

    def __str__(self):
        return f"DynamicPrice {self.court} on {self.date or 'rule'}: {self.adjusted_price}"


class Report(models.Model):
    """
    Reports for moderation (facilities or users). Admins act on these.
    """
    REPORT_TARGET_CHOICES = [("facility", "Facility"), ("user", "User")]
    STATUS_CHOICES = [("open", "Open"), ("resolved", "Resolved")]

    reporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                 related_name="reports_made")
    target_type = models.CharField(max_length=16,
                                   choices=REPORT_TARGET_CHOICES)
    target_id = models.IntegerField()  # polymorphic pointer
    reason = models.TextField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="open")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["target_type", "target_id"]),
                   models.Index(fields=["status"])]

    def __str__(self):
        return f"Report [{self.target_type}:{self.target_id}] by {self.reporter}"


class AdminAction(models.Model):
    """
    Audit log for admin actions (e.g., facility approval).
    """
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                              related_name="admin_actions")
    action_type = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action_type} by {self.admin} at {self.created_at}"
