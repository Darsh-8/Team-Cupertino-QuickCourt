from django.apps import AppConfig


class BookingsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.bookings"

    def ready(self):
        # Register signals
        try:
            import apps.bookings.signals  # noqa: F401
        except Exception:
            pass
