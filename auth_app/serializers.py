# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)  # Add role field

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')  # Extract role from validated data
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        Profile.objects.create(user=user, role=role)  # Create profile with role
        return user