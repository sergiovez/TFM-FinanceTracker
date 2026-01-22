"""
WSGI config for finance_tracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Configura la variable de entorno para usar los settings del proyecto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_tracker.settings')

# Inicializa la aplicación WSGI de Django
application = get_wsgi_application()
