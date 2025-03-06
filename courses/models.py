from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()  # To order lessons within a course

    # Video and PDF fields
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)  # Optional
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)  # Optional
    
    def __str__(self):
        return self.title