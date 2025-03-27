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
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        # Handle first_name and last_name during creation
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=make_password(validated_data['password'])
        )
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        # Update user fields including first_name and last_name
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile fields
        if profile_data:
            profile_serializer = ProfileSerializer(
                profile, 
                data=profile_data, 
                partial=True,
                context=self.context
            )
            if profile_serializer.is_valid():
                profile_serializer.save()

        return instance