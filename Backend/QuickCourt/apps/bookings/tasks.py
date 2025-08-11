# Celery tasks for async work (email, push, etc.)
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import Booking


@shared_task
def send_booking_confirmation(booking_id):
    try:
        booking = Booking.objects.get(pk=booking_id)
    except Booking.DoesNotExist:
        return

    subject = f"Booking Confirmed: #{booking.booking_id}"
    message = f"Hi {booking.user}, your booking is confirmed for {booking.date} {booking.start_time}-{booking.end_time} at {booking.court.name}."
    recipient = [booking.user.email]

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient)
    return True
