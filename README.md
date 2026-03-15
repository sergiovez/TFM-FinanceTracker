# Finance Tracker

Finance Tracker es una aplicación web para la gestión y control de gastos personales.  
Permite a los usuarios registrar, organizar y visualizar sus gastos de forma sencilla.

El proyecto ha sido desarrollado como **Proyecto Final de Máster**, integrando un backend en Django con un frontend en React.

# Demo

Aplicación desplegada:

https://finance-tracker-s1ww.onrender.com

# Tecnologías utilizadas
    ## Backend

    - Django
    - Django REST Framework
    - PostgreSQL
    - WhiteNoise
    - SendGrid (envío de emails)

    ## Frontend

    - React
    - JavaScript
    - Fetch API
    - CSS

    ## Infraestructura

    - Git
    - GitHub
    - Render (deploy en la nube)

# Arquitectura del proyecto

El proyecto sigue una arquitectura **Full Stack** separando backend y frontend.
React (frontend) -> Fetch API -> Django REST API -> PostgreSQL Database


El frontend React consume datos del backend mediante llamadas HTTP a la API REST de Django.

# Funcionalidades principales

- Registro de usuarios
- Inicio de sesión
- Gestión de gastos personales
- Categorías de gasto
- Visualización de gastos
- Solicitud de acceso mediante formulario
- Envío de email al administrador

# Tipos de usuario

    ## Visitante
    Puede solicitar acceso a la aplicación mediante el formulario de registro.

    ## Usuario registrado
    Puede:
    - crear gastos
    - editar gastos
    - eliminar gastos
    - visualizar sus datos

    ## Administrador
    Puede:
    - gestionar usuarios
    - acceder al panel de administración de Django

# Instalación local
    ## 1. Clonar repositorio
    git clone https://github.com/sergiovez/TFM-FinanceTracker

    ## 2. Crear entorno virtual
    python -m venv venv

    ## 3. Activar entorno
    source venv/bin/activate

    ## 4. Instalar dependencias
    pip install -r requirements.txtº

    ## 5. Variables de entorno
    Crear archivo .env con:
        SECRET_KEY=your_secret_key
        DEBUG=True
        DATABASE_URL=sqlite:///db.sqlite3
        SENDGRID_API_KEY=your_sendgrid_key
        EMAIL_HOST_USER=apikey
        EMAIL_ENVIO=your_email

    ## 6. Migraciones
    python manage.py migrate

    ## 7. Crear superusuario
    python manage.py createsuperuser

    ## 8. Ejecutar servidor
    python manage.py runserver

    Abrir en navegador:
    hhtps://127.0.0.1:8000

# Seguridad
El proyecto implementa varias medidas de seguridad:

- Autenticación de usuarios mediante Django
- Hashing seguro de contraseñas
- Protección CSRF
- Variables sensibles mediante variables de entorno
- Uso de HTTPS en producción
- Gestión segura de sesiones

# Despliegue
La aplicación está desplegada en **Render**.
Incluye:
- servidor Django
- base de datos PostgreSQL
- variables de entorno seguras

# Autor
Proyecto desarrollado por **Sergio Vez** como Proyecto Final de Máster.
