from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, LessonViewSet, CategoryViewSet,
    user_courses, enroll_course, check_enrollment, withdraw_course,
    reject_enrollment, list_enrollment_requests, approve_enrollment,
    request_enrollment, student_enrollment_requests, check_enrollment_request, withdraw_enrollment_request
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user-courses/', user_courses, name='user-courses'),
    path('enroll-course/<int:course_id>/', enroll_course, name='enroll-course'),
    path('check-enrollment/<int:course_id>/', check_enrollment, name='check-enrollment'),
    path('withdraw-course/<int:course_id>/', withdraw_course, name='withdraw-course'),
    path('request-enrollment/<int:course_id>/', request_enrollment, name='request-enrollment'),
    path('approve-enrollment/<int:request_id>/', approve_enrollment, name='approve-enrollment'),
    path('reject-enrollment/<int:request_id>/', reject_enrollment, name='reject-enrollment'),
    path('list-enrollment-requests/', list_enrollment_requests, name='list-enrollment-requests'),
    path('student-enrollment-requests/', student_enrollment_requests, name='student-enrollment-requests'),
    path('check-enrollment-request/<int:course_id>/', check_enrollment_request, name='check-enrollment-request'),  # Add the new endpoint
    path('withdraw-enrollment-request/<int:request_id>/', withdraw_enrollment_request, name='withdraw-enrollment-request'),
]