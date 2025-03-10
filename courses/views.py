from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Course, Lesson, Category, CourseEnrollment
from auth_app.models import Profile
from .serializers import CourseSerializer, LessonSerializer, CategorySerializer, CourseEnrollmentSerializer
from .permissions import IsInstructorOrReadOnly

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_courses(request):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role == "instructor":
            courses = Course.objects.filter(instructor=user)
        else:
            enrollments = CourseEnrollment.objects.filter(student=user)
            courses = [enrollment.course for enrollment in enrollments]
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_enrollment(request, course_id):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role == "instructor":
            return Response({"error": "Instructors cannot enroll in courses."}, status=403)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        # Check if the user is enrolled
        is_enrolled = CourseEnrollment.objects.filter(student=user, course=course).exists()
        return Response({"is_enrolled": is_enrolled}, status=200)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role == "instructor":
            return Response({"error": "Instructors cannot enroll in courses."}, status=403)
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        # Check if the user is already enrolled
        if CourseEnrollment.objects.filter(student=user, course=course).exists():
            return Response({"error": "You are already enrolled in this course."}, status=400)

        # Enroll the student
        enrollment = CourseEnrollment(student=user, course=course)
        enrollment.save()
        return Response({"message": "Successfully enrolled in the course."}, status=201)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    
    
    

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related("lessons").all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def perform_create(self, serializer):
        category_id = self.request.data.get('category')
        category = Category.objects.get(id=category_id) if category_id else None
        serializer.save(instructor=self.request.user, category=category)

    def perform_update(self, serializer):
        category_id = self.request.data.get('category')
        category = Category.objects.get(id=category_id) if category_id else serializer.instance.category
        serializer.save(category=category)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]