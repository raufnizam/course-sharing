from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet, VideoViewSet, PDFViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'pdfs', PDFViewSet)

urlpatterns = [
    path('', include(router.urls)),
]