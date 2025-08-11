from django.conf import settings
from django.db import models

# admin_panel reuses the core models from facilities to avoid duplication
from apps.facilities.models import AdminAction, Report
from apps.facilities.models import Facility


# No extra model definitions here unless admin_panel has unique models


class AdminAction(models.Model):
    ACTION_TYPES = [
        ('facility_approval', 'Facility Approval'),
        ('facility_rejection', 'Facility Rejection'),
        ('user_ban', 'User Ban'),
        ('user_unban', 'User Unban'),
        ('report_resolution', 'Report Resolution'),
    ]

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        limit_choices_to={'role': 'admin'}
    )
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action_type} by {self.admin.email}"


class Report(models.Model):
    TARGET_TYPES = [
        ('facility', 'Facility'),
        ('user', 'User'),
    ]

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="reports_made"
    )
    target_type = models.CharField(max_length=20, choices=TARGET_TYPES)
    target_id = models.PositiveIntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[('open', 'Open'), (
        'resolved', 'Resolved')], default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report on {self.target_type} #{self.target_id} - {self.status}"
