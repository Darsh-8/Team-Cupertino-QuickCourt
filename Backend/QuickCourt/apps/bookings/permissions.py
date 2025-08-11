from rest_framework import permissions


class IsBookingOwnerOrAdmin(permissions.BasePermission):
    """
    Allow booking owner or admin to modify/cancel.
    Expects User model to have 'role' attribute (admin/owner/user).
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, "role", None) == "admin":
            return True
        return obj.user == request.user
