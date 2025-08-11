from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenBlacklistView

from .views import (
    RegisterView, VerifyOTPView, CustomTokenObtainPairView,
    SlidingTokenRefreshView, MeView, ChangePasswordView,
    AdminUserManagementViewSet
)

router = DefaultRouter()
router.register(r'admin/users', AdminUserManagementViewSet,
                basename='admin-users')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='auth-verify-otp'),
    path('auth/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('auth/token/refresh/', SlidingTokenRefreshView.as_view(),
         name='token_refresh'),
    path('auth/token/blacklist/', TokenBlacklistView.as_view(),
         name='token_blacklist'),
    path('users/me/', MeView.as_view(), name='users-me'),
    path('users/me/change-password/', ChangePasswordView.as_view(),
         name='users-change-password'),
    path('', include(router.urls)),
]
