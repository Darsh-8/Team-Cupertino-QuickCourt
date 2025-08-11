from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, \
    TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['is_email_verified'] = user.is_email_verified
        token['username'] = user.username
        return token


class SlidingRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = RefreshToken(attrs['refresh'])
        try:
            refresh.blacklist()
        except Exception:
            pass
        new_refresh = RefreshToken.for_user(self.user)
        new_refresh['role'] = getattr(self.user, 'role', None)
        new_refresh['is_email_verified'] = getattr(self.user,
                                                   'is_email_verified', False)
        data['refresh'] = str(new_refresh)
        return data
