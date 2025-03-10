from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet, CategoryViewSet
from .views import user_courses


router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'categories', CategoryViewSet)




urlpatterns = [
    path('', include(router.urls)),
    path('user-courses/', user_courses, name='user-courses'),

]