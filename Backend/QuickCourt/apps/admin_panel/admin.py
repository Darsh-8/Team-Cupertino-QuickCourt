# apps/admin_panel/admin.py
"""
Admin customizations for the Admin Panel app.

IMPORTANT:
- This app intentionally does NOT register models that are defined
  in other apps (e.g. AdminAction in apps.facilities.models).
- Registering the same model in multiple apps causes Django's
  AlreadyRegistered error. If you want to provide admin views that
  operate on models from other apps, import admin classes from the
  owning app or use serializers / custom views / dashboard pages.

If you *do* need to register a model here (rare), use admin.site.unregister()
with try/except to avoid AlreadyRegistered exceptions — but prefer importing
the admin class from the owning app instead.
"""

# Intentionally left blank re: model registration.
# Example: if you need quick access to AdminAction in admin_panel,
# import the admin class from apps.facilities.admin instead of registering here:
#
# from apps.facilities.admin import AdminActionAdmin  # avoid double-register
#
# Or create dashboard views / links that use the models via serializers.
#
# If you intentionally want to override registration, you can unregister safely:
#
# from django.contrib.admin.sites import NotRegistered
# from apps.facilities.models import AdminAction
#
# try:
#     admin.site.unregister(AdminAction)
# except NotRegistered:
#     pass
#
# @admin.register(AdminAction)
# class AdminActionAdmin(admin.ModelAdmin):
#     ...  # override admin UI (but this replaces the facilities registration)
#
# Prefer NOT to register models here to keep responsibilities clear.
