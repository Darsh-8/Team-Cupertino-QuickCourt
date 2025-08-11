from django.apps import AppConfig


class FacilitiesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.facilities"

    def ready(self):
        # Import signals to register them
        try:
            import apps.facilities.signals  # noqa: F401
        except Exception:
            # In production we may want to log this
            pass
