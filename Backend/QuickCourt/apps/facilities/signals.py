from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AdminAction
from .models import Facility


@receiver(post_save, sender=Facility)
def facility_post_save(sender, instance, created, **kwargs):
    """
    Example signal: when a facility is approved, create an admin action log.
    You can expand to send notifications (Celery tasks) to owners, update search indices, etc.
    """
    if not created and instance.status == "approved":
        AdminAction.objects.create(
            admin=None,
            action_type="facility_approved_signal",
            details=f"Facility {instance.id} approved via signal hook"
        )
        # TODO: queue send notification to facility.owner (Celery)
