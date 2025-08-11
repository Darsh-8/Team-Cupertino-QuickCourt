import random
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from ..models import OTP

OTP_EXPIRY_SECONDS = getattr(settings, 'OTP_EXPIRY_SECONDS', 300)


def _generate_code(length=6):
    lower = 10 ** (length - 1)
    return str(random.randint(lower, 10 ** length - 1))


def generate_and_send_otp(identifier: str, user=None, purpose='signup',
                          length=6):
    code = _generate_code(length)
    expires_at = timezone.now() + timedelta(seconds=OTP_EXPIRY_SECONDS)
    otp = OTP.objects.create(user=user, identifier=identifier, code=code,
                             purpose=purpose, expires_at=expires_at)
    subject = f"[QuickCourt] Your OTP for {purpose}"
    message = f"Your OTP is: {code}. It expires in {OTP_EXPIRY_SECONDS // 60} minutes."
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL',
                         'no-reply@quickcourt.local')
    try:
        send_mail(subject, message, from_email, [identifier],
                  fail_silently=False)
    except Exception:
        print(f"[OTP SEND] To: {identifier} Code: {code}")
    return otp
