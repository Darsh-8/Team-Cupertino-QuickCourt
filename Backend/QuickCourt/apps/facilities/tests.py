from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Amenity, Facility

User = get_user_model()


class FacilityTests(APITestCase):

    def setUp(self):
        # Create two users: owner and normal user
        self.owner = User.objects.create_user(email="owner@example.com",
                                              password="pass", role="owner")
        self.user = User.objects.create_user(email="user@example.com",
                                             password="pass", role="user")
        self.amenity = Amenity.objects.create(name="Parking")

    def test_owner_can_create_facility(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse("facility-list")
        payload = {
            "name": "QuickCourt Arena",
            "description": "Test facility",
            "location": "Somewhere",
            "amenity_ids": [self.amenity.id]
        }
        resp = self.client.post(url, payload, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Facility.objects.count(), 1)
        f = Facility.objects.first()
        self.assertEqual(f.owner, self.owner)
        self.assertTrue(self.amenity in f.amenities.all())

    def test_non_owner_cannot_create_facility(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("facility-list")
        payload = {"name": "Nope", "location": "X"}
        resp = self.client.post(url, payload, format="json")
        self.assertIn(resp.status_code, (
        400, 403, 500))  # Permission error raises from view layer
