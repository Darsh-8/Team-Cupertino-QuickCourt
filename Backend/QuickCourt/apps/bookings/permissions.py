from rest_framework import permissions


class IsBookingOwnerOrAdmin(permissions.BasePermission):
    """
    Allow access if user is booking owner or is admin. Admin role detection assumes
    `request.user.role == 'admin'` or `is_staff` (adjust to your auth model).
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, "role",
                   None) == "admin" or request.user.is_staff:
            return True
        return obj.user_id == request.user.id
