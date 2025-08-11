from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from apps.facilities.models import AdminAction
from .models import Booking


@receiver(post_save, sender=Booking)
def booking_audit(sender, instance, created, **kwargs):
    if created:
        AdminAction.objects.create(admin=None, action_type="booking_created",
                                   details=f"Booking {instance.id} created",
                                   created_at=timezone.now())
    else:
        AdminAction.objects.create(admin=None, action_type="booking_updated",
                                   details=f"Booking {instance.id} status={instance.status}",
                                   created_at=timezone.now())
