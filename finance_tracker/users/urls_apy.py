from django.urls import path
from .views_auth import csrf, login_api, logout_api, me_api

urlpatterns = [
    path("auth/csrf/", csrf),
    path("auth/login/", login_api),
    path("auth/logout/", logout_api),
    path("auth/me/", me_api),
]
