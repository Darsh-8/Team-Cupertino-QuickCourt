from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
    "id", "facility", "user", "rating", "is_published", "is_verified",
    "created_at")
    list_filter = ("is_published", "is_verified", "rating")
    search_fields = ("user__email", "facility__name", "comment")
    readonly_fields = ("created_at", "updated_at")
