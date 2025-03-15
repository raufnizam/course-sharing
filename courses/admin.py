from django.contrib import admin
from .models import Course, Lesson, CourseEnrollment, CourseEnrollmentRequest

admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(CourseEnrollment)
admin.site.register(CourseEnrollmentRequest)
