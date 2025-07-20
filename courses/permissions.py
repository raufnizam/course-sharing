from rest_framework import permissions
from auth_app.models import Profile

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow instructors of a course to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.instructor == request.user

class ProfileExistsPermission(permissions.BasePermission):
    """
    Custom permission to check if a user has a profile.
    """
    message = "User profile not found."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            request.user.profile
        except Profile.DoesNotExist:
            return False
        return True

class IsInstructorOrAdminForLesson(permissions.BasePermission):
    """
    Custom permission to only allow the course instructor or an admin to edit a lesson.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow edit/delete if the user is the course instructor or an admin
        return obj.course.instructor == request.user or request.user.profile.role == 'admin'
