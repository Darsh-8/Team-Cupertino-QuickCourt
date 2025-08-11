from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
    "id", "user", "court", "date", "start_time", "end_time", "total_price",
    "status", "created_at")
    list_filter = ("status", "date", "court")
    search_fields = ("user__email", "court__name", "court__facility__name")
    readonly_fields = ("created_at", "updated_at")
