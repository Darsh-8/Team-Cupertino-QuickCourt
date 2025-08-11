# Optional Celery tasks — safe placeholders.
import logging

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(ignore_result=True)
def send_telegram_alert(booking_id, message):
    logger.info(
        f"[Telegram] Booking {booking_id} -> {message} at {timezone.now().isoformat()}")
    # implement actual Telegram API call here


@shared_task(ignore_result=True)
def log_booking_to_google_sheets(payload):
    logger.info(f"[Sheets] payload: {payload}")
    # implement Google Sheets API logging here


@shared_task(ignore_result=True)
def run_ml_prediction_hook(booking_id):
    logger.info(f"[ML] run prediction for booking {booking_id}")
    # call ML microservice or local function and store result
