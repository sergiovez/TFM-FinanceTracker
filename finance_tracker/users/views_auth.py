from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
import json

# Forzar envío de la cookie csrftoken
@ensure_csrf_cookie
@require_GET
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})

# Login vía JSON con sesión Django
@require_POST
def login_api(request):
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

# Logout del usuario
@require_POST
def logout_api(request):
    logout(request)
    return JsonResponse({"detail": "Logout correcto"})

# Devuelve info del usuario logueado
@require_GET
def me_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=401)

    return JsonResponse({
        "authenticated": True,
        "username": request.user.username,
    })
