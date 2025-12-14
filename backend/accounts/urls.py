from django.urls import path
from .views import RegisterView, CustomAuthToken, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('profile/', UserDetailView.as_view(), name='profile'),
]
