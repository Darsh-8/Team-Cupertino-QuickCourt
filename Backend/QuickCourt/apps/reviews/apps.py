from django.apps import AppConfig


class ReviewsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.reviews"

    def ready(self):
        # register signals
        try:
            import apps.reviews.signals  # noqa: F401
        except Exception:
            pass
