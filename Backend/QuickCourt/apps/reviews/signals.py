from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review


@receiver(post_save, sender=Review)
def update_facility_avg_on_save(sender, instance, created, **kwargs):
    """
    Recalculate the facility avg_rating when a review is created/updated.
    Only published reviews considered.
    """
    facility = instance.facility
    agg = facility.reviews.filter(is_published=True).aggregate(
        avg=Avg("rating"))
    facility.avg_rating = agg["avg"] or 0.0
    facility.save(update_fields=["avg_rating"])


@receiver(post_delete, sender=Review)
def update_facility_avg_on_delete(sender, instance, **kwargs):
    facility = instance.facility
    agg = facility.reviews.filter(is_published=True).aggregate(
        avg=Avg("rating"))
    facility.avg_rating = agg["avg"] or 0.0
    facility.save(update_fields=["avg_rating"])
