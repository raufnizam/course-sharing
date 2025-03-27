from rest_framework import serializers
from .models import Course, Lesson, Category, CourseEnrollment, CourseEnrollmentRequest

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class LessonSerializer(serializers.ModelSerializer):
    video_file_name = serializers.SerializerMethodField()
    pdf_file_name = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'order', 'course',
            'video_file', 'video_file_name', 'pdf_file', 'pdf_file_name',
        ]
        extra_kwargs = {
            'order': {'required': False},  # Make the order field optional
        }

    def get_video_file_name(self, obj):
        """Return the filename of the uploaded video."""
        return obj.video_file.name.split('/')[-1] if obj.video_file else None

    def get_pdf_file_name(self, obj):
        """Return the filename of the uploaded PDF."""
        return obj.pdf_file.name.split('/')[-1] if obj.pdf_file else None

    def create(self, validated_data):
        # Automatically set the order if not provided
        if 'order' not in validated_data:
            course = validated_data['course']
            last_lesson = Lesson.objects.filter(course=course).order_by('-order').first()
            validated_data['order'] = (last_lesson.order + 1) if last_lesson else 1
        return super().create(validated_data)

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'student', 'course', 'enrolled_at']
        read_only_fields = ['student', 'enrolled_at']
        

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  
    instructor = serializers.StringRelatedField()  # Use StringRelatedField for instructor
    category = serializers.StringRelatedField()  # Use StringRelatedField for category
    is_enrolled = serializers.SerializerMethodField()  # Add a field to check if the current user is enrolled

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'category', 
            'created_at', 'updated_at', 'lessons', 'is_enrolled',
        ]
        read_only_fields = ['instructor', 'created_at', 'updated_at']

    def get_is_enrolled(self, obj):
        """Check if the current user is enrolled in the course."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CourseEnrollment.objects.filter(student=request.user, course=obj).exists()
        return False
    
    
    
class CourseEnrollmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollmentRequest
        fields = ['id', 'student', 'course', 'message', 'status', 'requested_at']
        read_only_fields = ['student', 'status', 'requested_at']
    
    