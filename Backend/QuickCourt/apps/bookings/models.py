from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone

# NOTE: adapt these imports to your project app layout
from apps.facilities.models import Court, BlockedSlot  # ensure these exist

User = settings.AUTH_USER_MODEL


class Booking(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    booking_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="bookings")
    court = models.ForeignKey(Court, on_delete=models.CASCADE,
                              related_name="bookings")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES,
                              default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("court", "date", "start_time", "end_time")
        indexes = [
            models.Index(fields=["court", "date", "start_time", "end_time"]),
            models.Index(fields=["user", "created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking({self.booking_id}) {self.user} @ {self.court} {self.date} {self.start_time}-{self.end_time}"

    def clean(self):
        # Basic validation
        if self.start_time >= self.end_time:
            raise ValidationError("start_time must be before end_time")
        # Ensure booking is for future (or same day depending on rules)
        if self.date < timezone.localdate():
            raise ValidationError("Cannot create bookings for past dates")

    @classmethod
    def check_conflict(cls, court_id, date, start_time, end_time):
        """
        Returns True if conflict exists (either existing booking overlap or blocked slot overlap)
        """
        # Overlap condition:
        # existing.start < new.end AND existing.end > new.start
        booking_conflict = cls.objects.filter(
            court_id=court_id,
            date=date,
            status="confirmed"
        ).filter(
            Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
        ).exists()

        blocked_conflict = BlockedSlot.objects.filter(
            court_id=court_id,
            date=date
        ).filter(
            Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
        ).exists()

        return booking_conflict or blocked_conflict

    @classmethod
    def create_booking_atomic(cls, user, court, date, start_time, end_time,
                              price_calculator):
        """
        Creates a booking safely using row locking. price_calculator is a callable(court, date, start_time, end_time) -> Decimal
        Raises ValidationError if conflict or invalid.
        """
        # validate times
        if start_time >= end_time:
            raise ValidationError("start_time must be before end_time")

        if date < timezone.localdate():
            raise ValidationError("Cannot book for past dates")

        with transaction.atomic():
            # lock court row to reduce concurrent race conditions
            locked_court = Court.objects.select_for_update().get(pk=court.pk)

            # Double-check availability using DB (best-effort)
            conflict = cls.objects.select_for_update(of=()) \
                .filter(court=locked_court, date=date, status="confirmed") \
                .filter(
                Q(start_time__lt=end_time) & Q(end_time__gt=start_time)) \
                .exists()

            blocked = BlockedSlot.objects.select_for_update(of=()) \
                .filter(court=locked_court, date=date) \
                .filter(
                Q(start_time__lt=end_time) & Q(end_time__gt=start_time)) \
                .exists()

            if conflict or blocked:
                raise ValidationError("Selected slot is not available")

            # compute price (allow dynamic pricing)
            total_price = price_calculator(locked_court, date, start_time,
                                           end_time)

            booking = cls.objects.create(
                user=user,
                court=locked_court,
                date=date,
                start_time=start_time,
                end_time=end_time,
                total_price=total_price,
                status="confirmed",
            )

            # Optionally create Payment placeholder or trigger async notification
            return booking
