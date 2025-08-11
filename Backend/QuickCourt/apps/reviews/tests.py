from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from apps.facilities.models import Facility
from .models import Review

User = get_user_model()


class ReviewAPITests(APITestCase):
    def setUp(self):
        # create users
        self.owner = User.objects.create_user(email="owner@test.com",
                                              password="pass", role="owner")
        self.user = User.objects.create_user(email="user@test.com",
                                             password="pass", role="user")
        self.admin = User.objects.create_user(email="admin@test.com",
                                              password="pass", role="admin")
        # create facility
        self.facility = Facility.objects.create(owner=self.owner, name="F1",
                                                location="L1",
                                                status="approved")
        self.url_list = reverse('facility-reviews',
                                kwargs={"facility_id": self.facility.id})

    def test_create_review_by_user(self):
        self.client.force_authenticate(user=self.user)
        payload = {"rating": 5, "title": "Great!", "comment": "Nice courts"}
        resp = self.client.post(self.url_list, payload, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Review.objects.count(), 1)
        r = Review.objects.first()
        self.assertEqual(r.user, self.user)
        self.assertEqual(self.facility.avg_rating, 5.0)

    def test_owner_can_respond(self):
        # create review by user
        self.client.force_authenticate(user=self.user)
        payload = {"rating": 4, "comment": "Good"}
        resp = self.client.post(self.url_list, payload, format="json")
        rid = resp.data["id"]
        # owner responds
        self.client.force_authenticate(user=self.owner)
        resp2 = self.client.patch(
            reverse("review-owner-respond", kwargs={"pk": rid}),
            {"owner_response": "Thanks, will improve."}, format="json")
        self.assertEqual(resp2.status_code, 200)
        r = Review.objects.get(id=rid)
        self.assertTrue(r.owner_response)
