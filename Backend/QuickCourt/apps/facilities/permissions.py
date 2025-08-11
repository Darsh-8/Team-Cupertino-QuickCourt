from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allow full access to the owner of the facility (or court owner via facility),
    read-only for others. Admins get full access via IsAdminUser elsewhere.
    """

    def has_object_permission(self, request, view, obj):
        # Read allowed for any safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        # For Facility: owner is obj.owner
        if hasattr(obj, "owner"):
            return obj.owner == request.user

        # For Court/Schedule/BlockedSlot: resolve via facility
        if hasattr(obj, "facility"):
            return obj.facility.owner == request.user

        if hasattr(obj, "court") and hasattr(obj.court, "facility"):
            return obj.court.facility.owner == request.user

        return False


class IsFacilityOwnerOrAdmin(permissions.BasePermission):
    """
    Used for endpoints where either the facility owner or platform admin can act.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and getattr(request.user, "role",
                                                     None) == "admin":
            return True

        if hasattr(obj, "owner"):
            return obj.owner == request.user

        if hasattr(obj, "facility"):
            return obj.facility.owner == request.user

        return False
