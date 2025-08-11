from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    FacilityViewSet, AmenityViewSet, CourtViewSet, ScheduleViewSet,
    BlockedSlotViewSet, DynamicPricingViewSet, ReportViewSet
)

router = DefaultRouter()
router.register(r"facilities", FacilityViewSet, basename="facility")
router.register(r"amenities", AmenityViewSet, basename="amenity")
router.register(r"courts", CourtViewSet, basename="court")
router.register(r"schedules", ScheduleViewSet, basename="schedule")
router.register(r"blocked-slots", BlockedSlotViewSet, basename="blockedslot")
router.register(r"dynamic-pricing", DynamicPricingViewSet,
                basename="dynamicpricing")
router.register(r"reports", ReportViewSet, basename="report")

urlpatterns = [
    path("", include(router.urls)),
]
