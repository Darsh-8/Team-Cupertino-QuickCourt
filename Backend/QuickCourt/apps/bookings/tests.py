from datetime import date, time

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from apps.facilities.models import Facility, Court, BlockedSlot
from .models import Booking

User = get_user_model()


class BookingTests(APITestCase):
    def setUp(self):
        # users
        self.owner = User.objects.create_user(email="owner@test.com",
                                              password="pass", role="owner")
        self.user = User.objects.create_user(email="user@test.com",
                                             password="pass", role="user")
        # facility & court
        self.fac = Facility.objects.create(owner=self.owner, name="F1",
                                           location="L1", status="approved")
        self.court = Court.objects.create(facility=self.fac, name="C1",
                                          sport_type="badminton",
                                          price_per_hour=200,
                                          operating_start=time(8, 0),
                                          operating_end=time(22, 0))
        self.url = reverse("booking-list")

    def test_create_booking_success(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "court": self.court.id,
            "date": str(date.today()),
            "start_time": "10:00:00",
            "end_time": "11:00:00"
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Booking.objects.count(), 1)
        b = Booking.objects.first()
        self.assertEqual(b.user, self.user)
        self.assertEqual(b.status, "confirmed")

    def test_booking_conflict(self):
        # create first booking
        Booking.objects.create(user=self.user, court=self.court,
                               date=date.today(), start_time=time(10, 0),
                               end_time=time(11, 0), total_price=200)
        # second user tries to book overlapping slot
        other = User.objects.create_user(email="u2@test.com", password="pass",
                                         role="user")
        self.client.force_authenticate(user=other)
        payload = {
            "court": self.court.id,
            "date": str(date.today()),
            "start_time": "10:30:00",
            "end_time": "11:30:00"
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Time slot already booked", str(resp.data))

    def test_blocked_slot_prevents_booking(self):
        # create blocked slot
        BlockedSlot.objects.create(court=self.court, date=date.today(),
                                   start_time=time(12, 0),
                                   end_time=time(13, 0), reason="maintenance")
        self.client.force_authenticate(user=self.user)
        payload = {
            "court": self.court.id,
            "date": str(date.today()),
            "start_time": "12:00:00",
            "end_time": "13:00:00"
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Slot is blocked", str(resp.data))

    def test_cancel_booking(self):
        b = Booking.objects.create(user=self.user, court=self.court,
                                   date=date.today(), start_time=time(14, 0),
                                   end_time=time(15, 0), total_price=200)
        self.client.force_authenticate(user=self.user)
        url = reverse("booking-cancel", kwargs={"pk": b.id})
        resp = self.client.patch(url, {}, format="json")
        self.assertEqual(resp.status_code, 200)
        b.refresh_from_db()
        self.assertEqual(b.status, "cancelled")
