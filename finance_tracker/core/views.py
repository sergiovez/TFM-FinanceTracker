from django.shortcuts import render

# Vista principal del sitio
def home_view(request):
    return render(request, 'home.html')  # ruta dentro de core/templates/
