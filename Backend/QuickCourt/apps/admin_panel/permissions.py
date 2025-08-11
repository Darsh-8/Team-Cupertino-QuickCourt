from rest_framework import permissions


class IsPlatformAdmin(permissions.BasePermission):
    """
    Allow only users with role == 'admin' to access admin_panel endpoints.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "role",
                                                               None) == "admin")
