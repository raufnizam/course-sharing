from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet

# Create a router and register the ViewSet
router = DefaultRouter()
router.register(r'courses', CourseViewSet)

# Include the router's URLs in the urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]