from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import User
from apps.facilities.models import Facility
from .models import AdminAction, Report
from .permissions import IsAdminUserCustom
from .serializers import (
    AdminActionSerializer,
    FacilityApprovalSerializer,
    UserBanSerializer,
    ReportSerializer
)


class AdminFacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilityApprovalSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        facility = self.get_object()
        facility.status = 'approved'
        facility.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type='facility_approval',
            details=f"Approved facility #{facility.id}"
        )
        return Response({"detail": "Facility approved"},
                        status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        facility = self.get_object()
        facility.status = 'rejected'
        facility.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type='facility_rejection',
            details=f"Rejected facility #{facility.id}"
        )
        return Response({"detail": "Facility rejected"},
                        status=status.HTTP_200_OK)


class AdminUserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserBanSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    @action(detail=True, methods=['patch'])
    def ban(self, request, pk=None):
        user = self.get_object()
        user.status = 'banned'
        user.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type='user_ban',
            details=f"Banned user #{user.id}"
        )
        return Response({"detail": "User banned"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def unban(self, request, pk=None):
        user = self.get_object()
        user.status = 'active'
        user.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type='user_unban',
            details=f"Unbanned user #{user.id}"
        )
        return Response({"detail": "User unbanned"}, status=status.HTTP_200_OK)


class AdminReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.status = 'resolved'
        report.save()
        AdminAction.objects.create(
            admin=request.user,
            action_type='report_resolution',
            details=f"Resolved report #{report.id}"
        )
        return Response({"detail": "Report resolved"},
                        status=status.HTTP_200_OK)


class AdminActionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdminAction.objects.all().order_by('-created_at')
    serializer_class = AdminActionSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]
