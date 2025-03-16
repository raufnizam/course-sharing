from django.urls import path
from .views import register_user, login_user, user_profile, list_all_users, delete_user

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', user_profile, name='profile'),
    path('admin/users/', list_all_users, name='list_all_users'),  # Admin: List all users
    path('admin/users/<int:user_id>/', delete_user, name='delete_user'),  # Admin: Delete a user
]