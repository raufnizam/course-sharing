from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import Profile

import logging

logger = logging.getLogger(__name__)

# User Registration
@api_view(['POST'])
def register_user(request):
    logger.info("Registration request data: %s", request.data)  # Log request data
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger.error("Registration errors: %s", serializer.errors)  # Log validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User Login
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# User Profile
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = request.data.copy()
        if 'profile' not in data:
            data['profile'] = {}

        serializer = UserSerializer(user, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
    
# Admin: List All Users
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only admins can access
def list_all_users(request):
    users = User.objects.all()
    user_data = []
    for user in users:
        profile = user.profile
        user_data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": profile.role,
            "is_staff": user.is_staff,
            "is_active": user.is_active,
        })
    return Response(user_data)  # Ensure this returns an array

# Admin: Delete a User
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only admins can access
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
# Add this at the top with other imports
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404

# Add these new views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_ids(request):
    """Get multiple users by their IDs"""
    user_ids = request.query_params.get('ids', '').split(',')
    try:
        user_ids = [int(id) for id in user_ids if id]
    except ValueError:
        return Response({"error": "Invalid user IDs"}, status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(id__in=user_ids).select_related('profile')
    
    user_data = []
    for user in users:
        profile = getattr(user, 'profile', None)
        user_data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile": {
                "id": profile.id if profile else None,
                "full_name": profile.full_name if profile else None,
                "role": profile.role if profile else None
            }
        })
    
    return Response(user_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_detail(request, user_id):
    """Get detailed user information"""
    user = get_object_or_404(User, id=user_id)
    profile = getattr(user, 'profile', None)
    
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile": {
            "id": profile.id if profile else None,
            "full_name": profile.full_name if profile else None,
            "role": profile.role if profile else None,
            "bio": profile.bio if profile else None,
            # Add other profile fields as needed
        }
    }
    return Response(data)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, username):
    try:
        user = User.objects.get(username=username)
        profile = getattr(user, 'profile', None)
        
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile": {
                "id": profile.id if profile else None,
                "full_name": getattr(profile, 'full_name', None),
                "role": profile.role if profile else None,
                "bio": getattr(profile, 'bio', None),
                "phone_number": getattr(profile, 'phone_number', None),
                "profile_image": profile.profile_image.url if profile and profile.profile_image else None,
            }
        }
        return Response(data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)    

    