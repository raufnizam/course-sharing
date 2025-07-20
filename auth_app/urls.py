from django.urls import path
from .views import (
    register_user, login_user, user_profile, 
    list_all_users, delete_user,
    get_users_by_ids, get_user_detail
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', user_profile, name='profile'),
    path('admin/users/', list_all_users, name='list_all_users'),
    path('admin/users/<int:user_id>/', delete_user, name='delete_user'),
    
    # Add these new endpoints
    path('users/', get_users_by_ids, name='get_users_by_ids'),
    path('users/<int:user_id>/', get_user_detail, name='get_user_detail'),
]