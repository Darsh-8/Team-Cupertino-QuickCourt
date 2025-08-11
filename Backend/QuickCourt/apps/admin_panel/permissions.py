from rest_framework.permissions import BasePermission


class IsAdminUserCustom(BasePermission):
    """
    Custom permission to allow only users with role 'admin'
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role",
                                                         None) == "admin"
