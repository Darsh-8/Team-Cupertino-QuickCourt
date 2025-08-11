from django.contrib.auth import get_user_model
from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, \
    TokenRefreshView

from .permissions import IsAdmin
from .serializers import RegisterSerializer, VerifyOTPSerializer, \
    UserSerializer, ChangePasswordSerializer
from .tokens import CustomTokenObtainPairSerializer, SlidingRefreshSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class VerifyOTPView(generics.CreateAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = (permissions.AllowAny,)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SlidingTokenRefreshView(TokenRefreshView):
    serializer_class = SlidingRefreshSerializer


class   MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password changed successfully."},
                        status=status.HTTP_200_OK)


class AdminUserManagementViewSet(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    @action(detail=True, methods=['patch'])
    def ban(self, request, pk=None):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"detail": "User not found."},
                            status=status.HTTP_404_NOT_FOUND)
        user.status = 'banned'
        user.save(update_fields=['status'])
        return Response({"detail": "User banned."})

    @action(detail=True, methods=['patch'])
    def unban(self, request, pk=None):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"detail": "User not found."},
                            status=status.HTTP_404_NOT_FOUND)
        user.status = 'active'
        user.save(update_fields=['status'])
        return Response({"detail": "User unbanned."})
