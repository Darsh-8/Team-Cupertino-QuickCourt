from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import OTP
from .utils.otp import generate_and_send_otp

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.is_active = True
        user.set_password(password)
        user.save()
        generate_and_send_otp(identifier=user.email, user=user,
                              purpose='signup')
        return user


class VerifyOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    code = serializers.CharField()
    purpose = serializers.ChoiceField(choices=OTP.PURPOSE_CHOICES)

    def validate(self, data):
        identifier = data['identifier']
        code = data['code']
        purpose = data['purpose']
        try:
            otp_obj = OTP.objects.filter(
                identifier=identifier,
                purpose=purpose,
                code=code,
                consumed=False
            ).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired OTP.")

        if not otp_obj.is_valid():
            raise serializers.ValidationError("OTP is invalid or expired.")
        data['otp_obj'] = otp_obj
        return data

    def save(self, **kwargs):
        otp_obj: OTP = self.validated_data['otp_obj']
        if otp_obj.user:
            otp_obj.user.is_email_verified = True
            otp_obj.user.save(update_fields=['is_email_verified'])
        otp_obj.mark_consumed()
        return otp_obj.user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'avatar', 'status',
                  'is_email_verified', 'created_at')
        read_only_fields = ('id', 'status', 'created_at', 'is_email_verified')


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
