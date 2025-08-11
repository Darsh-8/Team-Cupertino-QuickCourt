from django.conf import settings
from django.db import models

from apps.facilities.models import Court


class Booking(models.Model):
    # Primary key is Django's default `id` (BigAutoField in Django 3.2+)
    # Do NOT define booking_id = AutoField(...)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    court = models.ForeignKey(
        Court,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed')
        ],
        default='confirmed'
    )
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(start_time__lt=models.F('end_time')),
                name="booking_start_before_end"
            )
        ]
        indexes = [
            models.Index(fields=["user", "status"])
        ]
        unique_together = ()  # Keep empty unless you want strict uniqueness rules

    def __str__(self):
        return f"Booking #{self.id} - {self.user} - {self.date}"
