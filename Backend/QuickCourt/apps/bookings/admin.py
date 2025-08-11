from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
    "booking_id", "user", "court", "date", "start_time", "end_time",
    "total_price", "status", "created_at")
    list_filter = ("status", "date", "court")
    search_fields = ("user__email", "court__name", "booking_id")
