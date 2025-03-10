from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet, CategoryViewSet
from .views import user_courses, enroll_course, check_enrollment, withdraw_course


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




]