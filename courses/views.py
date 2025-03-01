from rest_framework import viewsets, permissions
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Set the instructor to the currently logged-in user
        serializer.save(instructor=self.request.user)

    def perform_update(self, serializer):
        # Ensure only the instructor can update the course
        if serializer.instance.instructor == self.request.user:
            serializer.save()
        else:
            raise serializers.ValidationError("You are not the instructor of this course.")

    def perform_destroy(self, instance):
        # Ensure only the instructor can delete the course
        if instance.instructor == self.request.user:
            instance.delete()
        else:
            raise serializers.ValidationError("You are not the instructor of this course.")