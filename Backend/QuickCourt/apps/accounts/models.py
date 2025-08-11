import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('owner', 'Owner'),
        ('admin', 'Admin'),
    )
    STATUS_CHOICES = (
        ('active', 'active'),
        ('banned', 'banned'),
    )

    email = models.EmailField(unique=True, blank=False)
    role = models.CharField(max_length=12, choices=ROLE_CHOICES,
                            default='user')
    avatar = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES,
                              default='active')
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f"{self.username} <{self.email}> ({self.role})"


class OTP(models.Model):
    PURPOSE_CHOICES = (
        ('signup', 'signup'),
        ('password_reset', 'password_reset'),
        ('login_otp', 'login_otp'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name='otps')
    identifier = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=10)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    expires_at = models.DateTimeField()
    consumed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['identifier', 'purpose']),
            models.Index(fields=['user', 'purpose']),
        ]

    def is_valid(self):
        return (not self.consumed) and (timezone.now() <= self.expires_at)

    def mark_consumed(self):
        self.consumed = True
        self.save(update_fields=['consumed'])

    def __str__(self):
        return f"OTP {self.purpose} for {self.identifier or self.user_id}"
