from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AdminUserManagementViewSet, FacilityAdminViewSet, ReportAdminViewSet,
    BookingAdminListView, AdminDashboardView
)

router = DefaultRouter()
router.register(r'admin/users', AdminUserManagementViewSet,
                basename='admin-users')
router.register(r'admin/facilities', FacilityAdminViewSet,
                basename='admin-facilities')
router.register(r'admin/reports', ReportAdminViewSet, basename='admin-reports')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/bookings/', BookingAdminListView.as_view(),
         name='admin-bookings'),
    path('admin/dashboard/', AdminDashboardView.as_view(),
         name='admin-dashboard'),
]
