from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

# Vista principal del sitio
def home_view(request):
    return render(request, 'home.html')  # ruta dentro de core/templates/

# ------------------------------------------------------------
# Registro por email (NO crea usuario)
# ------------------------------------------------------------
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def register_request(request):
    name = request.data.get("name")
    surname = request.data.get("surname")
    username = request.data.get("username")
    email = request.data.get("email")

    if not name or not surname or not username or not email:
        return Response(
            {"detail": "Todos los campos son obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if "@" not in email:
        return Response(
            {"detail": "Email no válido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        send_mail(
            subject="Nueva solicitud de acceso",
            message=(
                f"Nueva solicitud de acceso:\n\n"
                f"Nombre: {name}\n"
                f"Apellidos: {surname}\n"
                f"Usuario: {username}\n"
                f"Email: {email}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=["sergiovez13@gmail.com"],
            fail_silently=False,
        )
    except Exception as e:
        print("Error enviando email:", e)
        return Response({"detail": "Error enviando solicitud"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(
        {"detail": "Solicitud enviada correctamente"},
        status=status.HTTP_200_OK
    )