# Importa la función path para definir rutas URL en Django
from django.urls import path
# Importamos las vistas de autenticación desde el archivo views_auth.py
from .views_auth import csrf, login_api, logout_api, me_api

from .views import update_profile

urlpatterns = [
    path("csrf/", csrf, name="csrf"),
    path("login/", login_api, name="login_api"),
    path("logout/", logout_api, name="logout_api"),
    path("me/", me_api, name="me_api"),
    path("profile/", update_profile),
]

