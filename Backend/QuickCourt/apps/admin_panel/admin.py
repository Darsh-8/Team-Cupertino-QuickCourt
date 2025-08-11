from django.contrib import admin

# No models defined here for this app; admin uses models from other apps.
# If you want an AdminAction admin view quick access:
from apps.facilities.models import AdminAction


@admin.register(AdminAction)
class AdminActionAdmin(admin.ModelAdmin):
    list_display = ("id", "admin", "action_type", "created_at")
    search_fields = ("action_type", "details", "admin__email")
    readonly_fields = ("created_at",)
