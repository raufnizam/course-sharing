from rest_framework import serializers
from .models import Course, Lesson, Video, PDF

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_file', 'description']

class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDF
        fields = ['id', 'title', 'pdf_file', 'description']

class LessonSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    pdfs = PDFSerializer(many=True, read_only=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    order = serializers.IntegerField(required=False)  # <-- Add this line

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'order', 'course', 'videos', 'pdfs']

    def create(self, validated_data):
        course = validated_data['course']
        
        # Automatically set the order if it's not provided
        last_lesson = Lesson.objects.filter(course=course).order_by('-order').first()
        validated_data['order'] = (last_lesson.order + 1) if last_lesson else 1
        
        return super().create(validated_data)




class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  # Include lessons in response

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'created_at', 'updated_at', 'lessons']
        read_only_fields = ['instructor', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)
