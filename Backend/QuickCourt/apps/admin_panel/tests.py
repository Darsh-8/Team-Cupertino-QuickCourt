from datetime import date, time

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from apps.bookings.models import Booking
from apps.facilities.models import Facility, Report

User = get_user_model()


class AdminPanelTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(email="adm@test.com",
                                              password="pass", role="admin")
        self.owner = User.objects.create_user(email="own@test.com",
                                              password="pass", role="owner")
        self.user = User.objects.create_user(email="usr@test.com",
                                             password="pass", role="user")
        # create facility pending
        self.fac = Facility.objects.create(owner=self.owner, name="F1",
                                           location="L1", status="pending")
        # create report
        self.report = Report.objects.create(reporter=self.user,
                                            target_type="facility",
                                            target_id=self.fac.id,
                                            reason="Issue")
        # booking sample
        self.booking = Booking.objects.create(user=self.user, court=None,
                                              date=date.today(),
                                              start_time=time(10, 0),
                                              end_time=time(11, 0),
                                              total_price=500)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.admin)

    def test_pending_list_and_approve(self):
        self.authenticate_admin()
        url = reverse("admin-facilities-pending-list")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        # approve
        approve_url = reverse("admin-facilities-approve",
                              kwargs={"pk": self.fac.id})
        resp2 = self.client.patch(approve_url)
        self.assertEqual(resp2.status_code, 200)
        self.fac.refresh_from_db()
        self.assertEqual(self.fac.status, "approved")

    def test_ban_unban_user(self):
        self.authenticate_admin()
        url = reverse("admin-users-ban-user", kwargs={"pk": self.user.id})
        resp = self.client.patch(url)
        self.assertEqual(resp.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.status, "banned")
        # unban
        url2 = reverse("admin-users-unban-user", kwargs={"pk": self.user.id})
        resp2 = self.client.patch(url2)
        self.assertEqual(resp2.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.status, "active")
