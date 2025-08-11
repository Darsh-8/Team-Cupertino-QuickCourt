from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AdminFacilityViewSet,
    AdminUserManagementViewSet,
    AdminReportViewSet,
    AdminActionViewSet
)

router = DefaultRouter()
router.register(r'facilities', AdminFacilityViewSet,
                basename='admin-facilities')
router.register(r'users', AdminUserManagementViewSet, basename='admin-users')
router.register(r'reports', AdminReportViewSet, basename='admin-reports')
router.register(r'actions', AdminActionViewSet, basename='admin-actions')

urlpatterns = [
    path('', include(router.urls)),
]
