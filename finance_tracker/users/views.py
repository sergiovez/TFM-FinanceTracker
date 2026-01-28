from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

@require_POST
@login_required
def update_profile(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "JSON inválido"}, status=400)

    user = request.user

    if data.get("password"):
        user.set_password(data["password"])

    user.first_name = data.get("name", user.first_name)
    user.last_name = data.get("surname", user.last_name)
    user.email = data.get("email", user.email)

    if "monthly_income" in data:
        user.monthly_income = data["monthly_income"]

    user.save()

    return JsonResponse({
        "username": user.username,
        "name": user.first_name,
        "surname": user.last_name,
        "email": user.email,
        "monthly_income": user.monthly_income,
    })
