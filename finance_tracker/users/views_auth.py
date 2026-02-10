# Importa las funciones de autenticación de Django:
# - authenticate: valida usuario y contraseña
# - login: crea la sesión del usuario
# - logout: elimina la sesión
from django.contrib.auth import authenticate, login, logout
# Permite devolver respuestas HTTP en formato JSON
from django.http import JsonResponse
# Fuerza el envio de la cookie CSRF al navegador
from django.views.decorators.csrf import ensure_csrf_cookie
# Limitar qué metodo HTTP acepta cada vista
# require_POST → solo acepta peticiones POST
# require_GET → solo acepta peticiones GET
from django.views.decorators.http import require_POST, require_GET, require_http_methods
import json

from django.views.decorators.csrf import csrf_exempt, csrf_protect


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

    # Autenticacion
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
@csrf_exempt
@require_http_methods(["GET", "POST"])
def me_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=401)

    user = request.user

    # GET → devolver datos del perfil
    if request.method == "GET":
        return JsonResponse({
            "authenticated": True,
            "username": user.username,
            "name": user.first_name,
            "surname": user.last_name,
            "email": user.email,
            "monthly_income": user.monthly_income,
        })

    # POST → actualizar perfil
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"detail": "JSON inválido"}, status=400)

        # Password (opcional)
        if data.get("password"):
            user.set_password(data["password"])

        user.first_name = data.get("name", user.first_name)
        user.last_name = data.get("surname", user.last_name)
        user.email = data.get("email", user.email)
        user.monthly_income = data.get("monthly_income", user.monthly_income)

        user.save()

        return JsonResponse({"detail": "Perfil actualizado"})

    return JsonResponse({"detail": "Método no permitido"}, status=405)
