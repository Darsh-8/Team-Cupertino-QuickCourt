from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from apps.facilities.models import Facility
from .models import Review
from .permissions import IsAuthorOrAdmin, IsFacilityOwnerOrAdmin
from .serializers import ReviewListSerializer, ReviewCreateSerializer, \
    OwnerResponseSerializer


class FacilityReviewListCreateView(generics.ListCreateAPIView):
    """
    GET /api/facilities/{facility_id}/reviews/  -> list reviews for that facility
    POST /api/facilities/{facility_id}/reviews/ -> create review for that facility (authenticated users)
    """
    serializer_class = ReviewListSerializer
    filterset_fields = ["is_published", "is_verified"]
    pagination_class = None  # change to default pagination if desired

    def get_queryset(self):
        facility_id = self.kwargs["facility_id"]
        return Review.objects.filter(facility_id=facility_id,
                                     is_published=True).select_related("user")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ReviewCreateSerializer
        return ReviewListSerializer

    def perform_create(self, serializer):
        facility_id = self.kwargs["facility_id"]
        facility = get_object_or_404(Facility, pk=facility_id,
                                     status="approved")
        # save with facility and user
        serializer.save(facility=facility, user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    /api/reviews/  -> list (admin) / create (not used if using facility endpoint)
    Admin can list all, moderate (unpublish), delete.
    Author can update their own review (edit comment/rating).
    """
    queryset = Review.objects.select_related("facility", "user").all()
    serializer_class = ReviewListSerializer

    def get_permissions(self):
        if self.action in ["list"]:
            # list only for admins (all reviews); public listing is per-facility endpoint
            return [IsAdminUser()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthorOrAdmin()]
        if self.action in ["owner_respond"]:
            return [IsFacilityOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return ReviewCreateSerializer
        return ReviewListSerializer

    @action(detail=True, methods=["patch"], url_path="owner-respond")
    def owner_respond(self, request, pk=None):
        """
        Facility owner posts a response to a review.
        Only facility owner or admin allowed.
        """
        review = self.get_object()
        # permission checked in get_permissions
        serializer = OwnerResponseSerializer(review, data=request.data,
                                             partial=True,
                                             context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="publish")
    def publish(self, request, pk=None):
        """Admin toggles is_published on/off"""
        review = self.get_object()
        if not (request.user and getattr(request.user, "role",
                                         None) == "admin"):
            return Response({"detail": "admin only"},
                            status=status.HTTP_403_FORBIDDEN)
        review.is_published = request.data.get("is_published", True)
        review.save()
        return Response({"id": review.id, "is_published": review.is_published})
