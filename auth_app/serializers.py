from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['role', 'profile_image', 'bio', 'phone_number']

    def update(self, instance, validated_data):
        if 'profile_image' in self.context['request'].FILES:
            instance.profile_image = self.context['request'].FILES['profile_image']
        instance.bio = validated_data.get('bio', instance.bio)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()
        return instance

        
        

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)  # Make profile optional

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})  # Get profile data if it exists
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        Profile.objects.create(user=user, **profile_data)  # Create profile with optional data
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        # Handle user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Handle profile fields
        profile.bio = profile_data.get('bio', profile.bio)
        profile.phone_number = profile_data.get('phone_number', profile.phone_number)
        if 'profile_image' in profile_data:
            profile.profile_image = profile_data['profile_image']
        profile.save()

        return instance