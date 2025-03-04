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

    def __str__(self):
        return self.title

class Video(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)  # Optional
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class PDF(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='pdfs')
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)  # Optional
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title