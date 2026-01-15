from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
import json

@ensure_csrf_cookie
@require_GET
def csrf(request):
    """Forzar envío de la cookie csrftoken"""
    return JsonResponse({"detail": "CSRF cookie set"})


@require_POST
def login_api(request):
    """Login vía JSON con sesión Django"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "JSON inválido"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Faltan credenciales"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Usuario o contraseña incorrectos"}, status=401)

    login(request, user)
    return JsonResponse({"detail": "Login correcto", "username": user.username})


@require_POST
def logout_api(request):
    """Logout del usuario"""
    logout(request)
    return JsonResponse({"detail": "Logout correcto"})


@require_GET
def me_api(request):
    """Devuelve info del usuario logueado"""
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=401)

    return JsonResponse({
        "authenticated": True,
        "username": request.user.username,
    })
