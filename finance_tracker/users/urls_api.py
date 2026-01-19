from django.urls import path
from .views_auth import csrf, login_api, logout_api, me_api

urlpatterns = [
    path("csrf/", csrf, name="csrf"),
    path("login/", login_api, name="login_api"),
    path("logout/", logout_api, name="logout_api"),
    path("me/", me_api, name="me_api"),
]
