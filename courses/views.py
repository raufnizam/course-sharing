from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
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
    
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def withdraw_course(request, course_id):
    user = request.user
    try:
        enrollment = CourseEnrollment.objects.get(student=user, course_id=course_id)
        enrollment.delete()
        return Response({"message": "Successfully withdrawn from the course."}, status=status.HTTP_200_OK)
    except CourseEnrollment.DoesNotExist:
        return Response({"error": "You are not enrolled in this course."}, status=status.HTTP_404_NOT_FOUND)
    
    

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
    
    
    # Enrolment
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CourseEnrollmentRequest
from .serializers import CourseEnrollmentRequestSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_enrollment(request, course_id):
    user = request.user
    try:
        profile = user.profile
        if profile.role == "instructor":
            return Response({"error": "Instructors cannot request enrollment."}, status=403)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        # Check if the user has already requested enrollment
        existing_request = CourseEnrollmentRequest.objects.filter(student=user, course=course).first()
        if existing_request:
            if existing_request.status == "pending":
                return Response({"error": "You have already requested enrollment in this course."}, status=400)
            elif existing_request.status == "rejected":
                # Update the existing request
                existing_request.message = request.data.get('message', '')
                existing_request.status = "pending"
                existing_request.save()
                return Response({"message": "Enrollment request re-submitted successfully."}, status=200)

        # Create a new enrollment request
        enrollment_request = CourseEnrollmentRequest(
            student=user,
            course=course,
            message=request.data.get('message', '')  # Optional message
        )
        enrollment_request.save()
        return Response({"message": "Enrollment request submitted successfully."}, status=201)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    
    
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_enrollment(request, request_id):
    user = request.user
    try:
        enrollment_request = CourseEnrollmentRequest.objects.get(id=request_id)
        if enrollment_request.course.instructor != user:
            return Response({"error": "You are not the instructor of this course."}, status=403)

        if enrollment_request.status != 'pending':
            return Response({"error": "This request has already been processed."}, status=400)

        # Approve the request
        enrollment_request.status = 'approved'
        enrollment_request.save()

        # Enroll the student in the course
        CourseEnrollment.objects.create(student=enrollment_request.student, course=enrollment_request.course)

        return Response({"message": "Enrollment request approved successfully."}, status=200)
    except CourseEnrollmentRequest.DoesNotExist:
        return Response({"error": "Enrollment request not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_enrollment(request, request_id):
    user = request.user
    try:
        enrollment_request = CourseEnrollmentRequest.objects.get(id=request_id)
        if enrollment_request.course.instructor != user:
            return Response({"error": "You are not the instructor of this course."}, status=403)

        if enrollment_request.status != 'pending':
            return Response({"error": "This request has already been processed."}, status=400)

        # Reject the request
        enrollment_request.status = 'rejected'
        enrollment_request.save()

        return Response({"message": "Enrollment request rejected successfully."}, status=200)
    except CourseEnrollmentRequest.DoesNotExist:
        return Response({"error": "Enrollment request not found."}, status=404)
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_enrollment_requests(request):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role != "instructor":
            return Response({"error": "Only instructors can view enrollment requests."}, status=403)

        # Get all pending enrollment requests for courses taught by the instructor
        enrollment_requests = CourseEnrollmentRequest.objects.filter(course__instructor=user, status='pending')
        serializer = CourseEnrollmentRequestSerializer(enrollment_requests, many=True)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_enrollment_requests(request):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role != "student":
            return Response({"error": "Only students can view their enrollment requests."}, status=403)

        # Fetch enrollment requests made by the student
        enrollment_requests = CourseEnrollmentRequest.objects.filter(student=user)
        serializer = CourseEnrollmentRequestSerializer(enrollment_requests, many=True)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)    

    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_enrollment_request(request, course_id):
    user = request.user
    try:
        profile = user.profile  # Access the profile
        if profile.role == "instructor":
            return Response({"error": "Instructors cannot check enrollment requests."}, status=403)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        # Check if the user has an enrollment request for this course
        enrollment_request = CourseEnrollmentRequest.objects.filter(student=user, course=course).first()
        if enrollment_request:
            return Response({"status": enrollment_request.status}, status=200)
        else:
            return Response({"status": "no_request"}, status=200)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    
    
    
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def withdraw_enrollment_request(request, request_id):
    try:
        enrollment_request = CourseEnrollmentRequest.objects.get(id=request_id, student=request.user)
        if enrollment_request.status != "pending":
            return Response({"error": "Only pending requests can be withdrawn."}, status=400)
        enrollment_request.delete()
        return Response({"message": "Enrollment request withdrawn successfully."}, status=200)
    except CourseEnrollmentRequest.DoesNotExist:
        return Response({"error": "Enrollment request not found."}, status=404)
    
    
    