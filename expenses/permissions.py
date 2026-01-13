from rest_framework import permissions

# Permite acceso solo al propietario del objeto.
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
