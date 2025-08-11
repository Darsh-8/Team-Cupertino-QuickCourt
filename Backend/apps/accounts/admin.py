from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import OTP

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'username', 'email', 'role', 'status', 'is_email_verified',
        'created_at')
    list_filter = ('role', 'status', 'is_email_verified')
    search_fields = ('username', 'email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'identifier', 'purpose', 'expires_at', 'consumed', 'created_at')
    list_filter = ('purpose', 'consumed')
    search_fields = ('identifier',)
