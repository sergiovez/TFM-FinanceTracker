# Clase base de Django, se limpia automaticamente al terminar
from django.test import TestCase
# Devuelve el CustomUser no el User por defecto
from django.contrib.auth import get_user_model
# Cliente HTTP de prueba
from rest_framework.test import APIClient

User = get_user_model()

# Test de usuarios
class UsersAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usertest = User.objects.create_user(username='usertest', password='testpassword123')

    # POST: Registrar usuario correcto
    def test_register_user(self):
        response = self.client.post('/users/register/', {
            'username': 'newuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        })
        self.assertEqual(response.status_code, 302)

    # POST: Registrar usuario existente
    def test_register_existing_user(self):
        response = self.client.post('/users/register/', {
            'username': 'usertest',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        })
        self.assertEqual(response.status_code, 200)

    # POST: Login correcto
    def test_login_successful(self):
        response = self.client.post('/users/login/', {
            'username': 'usertest',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, 302)

    # POST: Login incorrecto
    def test_login_invalid_credentials(self):
        response = self.client.post('/users/login/', {
            'username': 'usertest',
            'password': 'passwordincorrecto'
        })
        self.assertEqual(response.status_code, 200)

    # GET: Logout correcto
    def test_logout_authenticated_user(self):
        self.client.login(username='usertest', password='testpassword123')
        response = self.client.get('/users/logout/')
        self.assertEqual(response.status_code, 302)

    # GET: Logout incorrecto
    def test_logout_anonymous_user(self):
        response = self.client.get('/users/logout/')
        self.assertEqual(response.status_code, 302)
