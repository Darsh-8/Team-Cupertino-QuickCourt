from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()


@receiver(post_save, sender=User)
def post_user_create(sender, instance: User, created, **kwargs):
    if created:
        try:
            send_mail(
                subject="Welcome to QuickCourt",
                message=f"Hi {instance.username}, welcome to QuickCourt!",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL',
                                   'no-reply@quickcourt.local'),
                recipient_list=[instance.email],
                fail_silently=True
            )
        except Exception:
            pass
