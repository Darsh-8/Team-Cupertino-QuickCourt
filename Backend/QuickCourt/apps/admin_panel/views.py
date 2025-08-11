from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bookings.models import Booking
from apps.facilities.models import Facility, Report, AdminAction
from .permissions import IsPlatformAdmin
from .serializers import (
    AdminUserSerializer, FacilityAdminListSerializer,
    FacilityAdminDetailSerializer,
    ReportSerializer, BookingListSerializer
)

User = get_user_model()


class AdminUserManagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin-only: list and retrieve users. Ban/unban handled via custom actions.
    """
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    @action(detail=True, methods=["patch"], url_path="ban")
    def ban_user(self, request, pk=None):
        user = self.get_object()
        if getattr(user, "role", None) == "admin":
            return Response({"detail": "Cannot ban another admin."},
                            status=status.HTTP_400_BAD_REQUEST)
        user.status = "banned"
        user.save(update_fields=["status"])
        AdminAction.objects.create(admin=request.user, action_type="ban_user",
                                   details=f"Banned user {user.id}")
        return Response({"id": user.id, "status": user.status})

    @action(detail=True, methods=["patch"], url_path="unban")
    def unban_user(self, request, pk=None):
        user = self.get_object()
        user.status = "active"
        user.save(update_fields=["status"])
        AdminAction.objects.create(admin=request.user,
                                   action_type="unban_user",
                                   details=f"Unbanned user {user.id}")
        return Response({"id": user.id, "status": user.status})


class FacilityAdminViewSet(viewsets.ModelViewSet):
    """
    Admin management for facilities: list pending, approve, reject, full CRUD if needed.
    """
    queryset = Facility.objects.select_related("owner").all().order_by(
        "-created_at")
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get_serializer_class(self):
        if self.action in ["list", "pending_list"]:
            return FacilityAdminListSerializer
        return FacilityAdminDetailSerializer

    def list(self, request, *args, **kwargs):
        # default admin listing (all facilities)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="pending")
    def pending_list(self, request):
        qs = Facility.objects.filter(status="pending").order_by("created_at")
        page = self.paginate_queryset(qs)
        serializer = FacilityAdminListSerializer(
            page if page is not None else list(qs), many=True,
            context={"request": request})
        return self.get_paginated_response(
            serializer.data) if page is not None else Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="approve")
    def approve(self, request, pk=None):
        facility = self.get_object()
        old = facility.status
        facility.status = "approved"
        facility.save(update_fields=["status"])
        AdminAction.objects.create(admin=request.user,
                                   action_type="facility_approval",
                                   details=f"Approved facility {facility.id} (was {old})")
        return Response({"id": facility.id, "status": facility.status})

    @action(detail=True, methods=["patch"], url_path="reject")
    def reject(self, request, pk=None):
        facility = self.get_object()
        old = facility.status
        facility.status = "rejected"
        facility.save(update_fields=["status"])
        AdminAction.objects.create(admin=request.user,
                                   action_type="facility_rejection",
                                   details=f"Rejected facility {facility.id} (was {old})")
        return Response({"id": facility.id, "status": facility.status})


class ReportAdminViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for reports, plus resolving.
    """
    queryset = Report.objects.select_related("reporter").all().order_by(
        "-created_at")
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    @action(detail=True, methods=["patch"], url_path="resolve")
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.status = "resolved"
        report.save(update_fields=["status"])
        AdminAction.objects.create(admin=request.user,
                                   action_type="report_resolved",
                                   details=f"Resolved report {report.id}")
        return Response({"id": report.id, "status": report.status})


class BookingAdminListView(generics.ListAPIView):
    """
    Admin-only bookings list: recent bookings, filter by status via query params.
    """
    serializer_class = BookingListSerializer
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        qs = Booking.objects.select_related("user", "court",
                                            "court__facility").all().order_by(
            "-created_at")
        status_q = self.request.query_params.get("status")
        if status_q:
            qs = qs.filter(status=status_q)
        return qs


class AdminDashboardView(APIView):
    """
    Returns aggregated metrics for admin dashboard.
    """
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request, *args, **kwargs):
        # Basic counts
        total_users = User.objects.count()
        total_owners = User.objects.filter(role="owner").count()
        total_facilities = Facility.objects.count()
        pending_facilities = Facility.objects.filter(status="pending").count()
        total_bookings = Booking.objects.count()
        bookings_today = Booking.objects.filter(
            date=timezone.localdate()).count()
        recent_reports = Report.objects.filter(status="open").order_by(
            "-created_at")[:5].values("id", "target_type", "target_id",
                                      "reason", "created_at")
        # top facilities by avg_rating (denormalized field)
        top_facilities = Facility.objects.filter(status="approved").order_by(
            "-avg_rating")[:5].values("id", "name", "avg_rating")

        data = {
            "total_users": total_users,
            "total_owners": total_owners,
            "total_facilities": total_facilities,
            "pending_facilities": pending_facilities,
            "total_bookings": total_bookings,
            "bookings_today": bookings_today,
            "open_reports_count": Report.objects.filter(status="open").count(),
            "recent_reports": list(recent_reports),
            "top_facilities": list(top_facilities),
        }
        return Response(data)
