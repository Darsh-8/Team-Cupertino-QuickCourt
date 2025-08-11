from datetime import time
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.facilities.models import Court, Facility

User = get_user_model()


class BookingAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="user@example.com",
                                             password="pass1234", name="u")
        self.owner = User.objects.create_user(email="owner@example.com",
                                              password="pass1234",
                                              name="owner", role="owner")
        self.facility = Facility.objects.create(owner=self.owner,
                                                name="Test Facility",
                                                location="Somewhere")
        self.court = Court.objects.create(facility=self.facility,
                                          name="Court A",
                                          sport_type="badminton",
                                          price_per_hour=Decimal("200.00"),
                                          operating_start=time(6, 0),
                                          operating_end=time(22, 0))
        self.client.force_authenticate(self.user)

    def test_create_booking_success(self):
        url = reverse("bookings-list")
        payload = {
            "court_id": self.court.pk,
            "date": (timezone.localdate() + timezone.timedelta(
                days=1)).isoformat(),
            "start_time": "10:00:00",
            "end_time": "11:00:00",
        }
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertIn("booking_id", res.data)
        self.assertEqual(res.data["total_price"], "200.00")

    def test_create_booking_conflict(self):
        # create initial booking
        from apps.bookings.models import Booking
        booking = Booking.objects.create(user=self.user, court=self.court,
                                         date=timezone.localdate() + timezone.timedelta(
                                             days=1), start_time=time(10, 0),
                                         end_time=time(11, 0),
                                         total_price=Decimal("200.00"))
        # attempt conflicting booking by another user
        other = User.objects.create_user(email="other@example.com",
                                         password="pass1234", name="other")
        self.client.force_authenticate(other)
        url = reverse("bookings-list")
        payload = {
            "court_id": self.court.pk,
            "date": booking.date.isoformat(),
            "start_time": "10:30:00",
            "end_time": "11:30:00",
        }
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, 400)
