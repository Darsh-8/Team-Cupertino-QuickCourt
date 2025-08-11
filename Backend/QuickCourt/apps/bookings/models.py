from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Booking(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="bookings")
    # Court model referenced from facilities app
    court = models.ForeignKey("apps.facilities.Court",
                              on_delete=models.PROTECT,
                              related_name="bookings")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Optional metadata (payment id, promo code)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["court", "date", "start_time", "end_time"]),
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"Booking {self.id} - Court {self.court_id} on {self.date} {self.start_time}-{self.end_time}"
