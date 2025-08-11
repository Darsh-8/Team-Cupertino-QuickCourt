from rest_framework import permissions


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Allow update/delete to the review author or admin.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and getattr(request.user, "role", None) == "admin":
            return True
        # allow the author to edit/delete their review
        if obj.user and obj.user == request.user:
            return True
        return False


class IsFacilityOwnerOrAdmin(permissions.BasePermission):
    """
    Allow facility owner to post owner_response, and admin to do anything.
    """

    def has_object_permission(self, request, view, obj):
        # Admin full access
        if request.user and getattr(request.user, "role", None) == "admin":
            return True
        # If the user is facility owner, allow owner_response action
        # We expect the view to check action name if needed
        try:
            facility_owner = obj.facility.owner
            return facility_owner == request.user
        except Exception:
            return False
