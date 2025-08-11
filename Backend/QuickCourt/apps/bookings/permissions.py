from rest_framework import permissions


class IsBookingOwnerOrAdmin(permissions.BasePermission):
    """
    Allow owners of the booking or admins to modify/cancel.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and getattr(request.user, "role", None) == "admin":
            return True
        return obj.user == request.user
