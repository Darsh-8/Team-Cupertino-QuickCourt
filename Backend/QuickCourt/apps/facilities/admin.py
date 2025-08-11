# apps/facilities/admin.py
"""
Admin registrations for models defined in the facilities app.
This file is the single place where AdminAction (audit log) is registered,
which prevents AlreadyRegistered exceptions.
"""

from django.contrib import admin

from .models import (
    Amenity, Facility, Court, Schedule, BlockedSlot,
    DynamicPricing, Report, AdminAction
)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = (
    "id", "name", "owner", "status", "avg_rating", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "location", "owner__email")
    raw_id_fields = ("owner",)
    filter_horizontal = ("amenities",)


@admin.register(Court)
class CourtAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "sport_type", "facility", "price_per_hour")
    list_filter = ("sport_type", "facility")


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = (
    "id", "court", "date", "start_time", "end_time", "is_available")
    list_filter = ("is_available", "date")


@admin.register(BlockedSlot)
class BlockedSlotAdmin(admin.ModelAdmin):
    list_display = (
    "id", "court", "date", "start_time", "end_time", "reason", "created_by")


@admin.register(DynamicPricing)
class DynamicPricingAdmin(admin.ModelAdmin):
    list_display = (
    "id", "court", "date", "base_price", "adjusted_price", "expires_at")


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
    "id", "reporter", "target_type", "target_id", "status", "created_at")
    list_filter = ("status",)


@admin.register(AdminAction)
class AdminActionAdmin(admin.ModelAdmin):
    """
    Audit log for admin actions. Registered here once (facilities app).
    Keep this registration here — do not re-register in other apps.
    """
    list_display = ("id", "admin", "action_type", "created_at")
    readonly_fields = ("created_at",)
    search_fields = ("action_type", "details", "admin__email")
