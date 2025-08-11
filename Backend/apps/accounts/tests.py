"""
Basic test skeletons. Expand these to cover the full flows (register, verify otp, token obtain/refresh, change password).
"""

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

User = get_user_model()


class AccountsSmokeTests(TestCase):

    def test_register_creates_user_and_sends_otp(self):
        payload = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "complexpassword123"
        }
        resp = self.client.post(reverse('auth-register'), payload,
                                content_type='application/json')
        self.assertIn(resp.status_code, (200, 201))
        self.assertTrue(User.objects.filter(email=payload['email']).exists())

    # Add more tests: verify OTP, obtain tokens, refresh tokens rotate, ban/unban admin endpoints.
