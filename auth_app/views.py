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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile = user.profile  # Access the profile
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
        "is_active": user.is_active,
        "date_joined": user.date_joined,
        "role": profile.role,  # Include role in the response
    }
    return Response(data)

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