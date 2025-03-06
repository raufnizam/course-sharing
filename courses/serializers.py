from rest_framework import serializers
from .models import Course, Lesson

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

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  # Include lessons in response

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'created_at', 'updated_at', 'lessons']
        read_only_fields = ['instructor', 'created_at', 'updated_at']
