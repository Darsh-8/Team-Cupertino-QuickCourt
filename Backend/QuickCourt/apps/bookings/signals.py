from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.facilities.models import AdminAction
from .models import Booking


@receiver(post_save, sender=Booking)
def booking_post_save(sender, instance, created, **kwargs):
    """
    Create an AdminAction audit log for booking creation/cancellation.
    """
    if created:
        AdminAction.objects.create(admin=None, action_type="booking_created",
                                   details=f"Booking {instance.id} created")
    else:
        AdminAction.objects.create(admin=None, action_type="booking_updated",
                                   details=f"Booking {instance.id} status={instance.status}")
