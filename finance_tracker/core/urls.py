from django.urls import path
from . import views
from .views import register_request

urlpatterns = [
    # path('', views.home_view, name='home'),
    path("register-request/", register_request),
]

