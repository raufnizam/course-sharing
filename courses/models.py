from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_created')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
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

# Add a new model for course enrollment
class CourseEnrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrolled_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrolled_students')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  # Ensure a student can't enroll in the same course twice

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"
    
    

class CourseEnrollmentRequest(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollment_requests')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollment_requests')
    message = models.TextField(blank=True, null=True)  # Optional message from the student
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  # Ensure a student can't request the same course twice

    def __str__(self):
        return f"{self.student.username} requested to enroll in {self.course.title}"    

