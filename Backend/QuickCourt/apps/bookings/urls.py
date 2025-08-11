from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, CourtAvailabilityView

router = DefaultRouter()
router.register(r"bookings", BookingViewSet, basename="bookings")

urlpatterns = [
    path("", include(router.urls)),
    path("courts/<int:court_id>/availability/",
         CourtAvailabilityView.as_view(), name="court-availability"),
]
