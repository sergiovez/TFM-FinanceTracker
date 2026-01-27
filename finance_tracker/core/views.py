from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Vista principal del sitio
def home_view(request):
    return render(request, 'home.html')  # ruta dentro de core/templates/

# ------------------------------------------------------------
# Registro por email (NO crea usuario)
# ------------------------------------------------------------
@csrf_exempt
def register_request(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")

        # Aquí luego enviarás email real
        print(f"Solicitud de registro: {email}")

        return JsonResponse({"ok": True})

    return JsonResponse({"error": "Método no permitido"}, status=405)
