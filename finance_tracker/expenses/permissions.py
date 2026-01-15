from rest_framework import permissions

# Permite acceso solo al propietario del objeto. O lectura si el objeto es global. 
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # GET
        if request.method in permissions.SAFE_METHODS:
            return obj.user is None or obj.user == request.user
        # PUT/POST/DELETE
        return obj.user == request.user
