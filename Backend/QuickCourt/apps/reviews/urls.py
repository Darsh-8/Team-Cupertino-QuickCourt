from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FacilityReviewListCreateView, ReviewViewSet

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = [
    # facility-scoped reviews (public listing + create by authenticated user)
    path("facilities/<int:facility_id>/reviews/",
         FacilityReviewListCreateView.as_view(), name="facility-reviews"),
    # generic review management (admin / author)
    path("", include(router.urls)),
]
