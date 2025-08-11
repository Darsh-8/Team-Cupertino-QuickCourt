from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

from . import models
from .filters import FacilityFilter, CourtFilter
from .models import Facility, Amenity, Court, Schedule, BlockedSlot, \
    DynamicPricing, Report, AdminAction
from .permissions import IsFacilityOwnerOrAdmin
from .serializers import (
    FacilityListSerializer, FacilityDetailSerializer,
    FacilityCreateUpdateSerializer,
    AmenitySerializer, CourtSerializer, ScheduleSerializer,
    BlockedSlotSerializer, DynamicPricingSerializer,
    ReportSerializer
)


# Facility endpoints
class FacilityViewSet(viewsets.ModelViewSet):
    """
    /api/facilities/
    - list: approved facilities (admins can see all via filter)
    - create: owner only
    - retrieve/update/delete: owner or admin
    - custom actions: approve/reject, list pending, list facility courts
    """
    queryset = Facility.objects.select_related("owner").prefetch_related(
        "amenities").all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]
    filterset_class = FacilityFilter
    search_fields = ["name", "description", "location"]
    ordering_fields = ["avg_rating", "created_at", "name"]

    def get_permissions(self):
        if self.action in ["pending_list", "approve", "reject"]:
            return [IsAuthenticated(), IsAdminUser()]
        if self.action in ["partial_update", "update", "destroy"]:
            return [IsAuthenticated(), IsFacilityOwnerOrAdmin()]
        if self.action in ["create"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action == "list":
            return FacilityListSerializer
        if self.action == "retrieve":
            return FacilityDetailSerializer
        return FacilityCreateUpdateSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request and not (
                self.request.user.is_authenticated and getattr(
            self.request.user, "role", None) == "admin"
        ):
            qs = qs.filter(status="approved")
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, "role", None) != "owner":
            raise PermissionDenied(
                "Only facility owners can create facilities.")
        serializer.save(owner=user)

    @action(detail=False, methods=["get"], url_path="pending")
    def pending_list(self, request):
        qs = Facility.objects.filter(status="pending")
        page = self.paginate_queryset(qs)
        serializer = FacilityListSerializer(page if page is not None else qs,
                                            many=True,
                                            context={"request": request})
        return self.get_paginated_response(
            serializer.data) if page is not None else Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="approve")
    def approve(self, request, pk=None):
        facility = self.get_object()
        old_status = facility.status
        facility.status = "approved"
        facility.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type="facility_approval",
            details=f"Changed status from {old_status} to approved for facility {facility.id}"
        )
        return Response({"status": "approved"})

    @action(detail=True, methods=["patch"], url_path="reject")
    def reject(self, request, pk=None):
        facility = self.get_object()
        old_status = facility.status
        facility.status = "rejected"
        facility.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type="facility_rejection",
            details=f"Changed status from {old_status} to rejected for facility {facility.id}"
        )
        return Response({"status": "rejected"})

    @action(detail=True, methods=["get"], url_path="courts")
    def courts(self, request, pk=None):
        facility = self.get_object()
        qs = facility.courts.all()
        page = self.paginate_queryset(qs)
        serializer = CourtSerializer(page if page is not None else qs,
                                     many=True, context={"request": request})
        return self.get_paginated_response(
            serializer.data) if page is not None else Response(serializer.data)


# Amenity viewset
class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated]  # admins should manage amenities


# Court endpoints
class CourtViewSet(viewsets.ModelViewSet):
    queryset = Court.objects.select_related("facility").all()
    serializer_class = CourtSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]
    filterset_class = CourtFilter
    search_fields = ["name", "sport_type"]

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsFacilityOwnerOrAdmin()]
        return [AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user
        facility = serializer.validated_data["facility"]
        if getattr(user, "role", None) == "admin" or facility.owner == user:
            serializer.save()
        else:
            raise PermissionDenied(
                "Only facility owner or admin can add a court.")


# Schedule endpoints
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.select_related("court").all()
    serializer_class = ScheduleSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsFacilityOwnerOrAdmin()]
        return [AllowAny()]


# Blocked slots
class BlockedSlotViewSet(viewsets.ModelViewSet):
    queryset = BlockedSlot.objects.select_related("court").all()
    serializer_class = BlockedSlotSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsFacilityOwnerOrAdmin()]
        return [AllowAny()]


# Dynamic pricing CRUD & fetch
class DynamicPricingViewSet(viewsets.ModelViewSet):
    queryset = DynamicPricing.objects.select_related("court").all()
    serializer_class = DynamicPricingSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsFacilityOwnerOrAdmin()]
        return [AllowAny()]

    @action(detail=False, methods=["get"], url_path="active")
    def active_prices(self, request):
        court_id = request.query_params.get("court")
        date = request.query_params.get("date")
        qs = self.queryset
        if court_id:
            qs = qs.filter(court_id=court_id)
        if date:
            qs = qs.filter(date=date)
        now = timezone.now()
        qs = qs.filter(
            models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=now))
        serializer = self.get_serializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data)


# Reports
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_permissions(self):
        if self.action in ["destroy", "update", "partial_update"]:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]
