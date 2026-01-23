# Clase base de Django, se limpia automaticamente al terminar
from django.test import TestCase
# Cliente HTTP de prueba
from rest_framework.test import APIClient
# Devuelve el CustomUser no el User por defecto
from django.contrib.auth import get_user_model
# Importamos los modelos de la app
from .models import Category, Expense
# Para validar fechas
from datetime import date, timedelta

User = get_user_model()

class ExpensesAPITest(TestCase):
    def setUp(self):
        # Usuarios
        self.usertest1 = User.objects.create_user(username='usertest1', password='testpassword123')
        self.usertest2 = User.objects.create_user(username='usertest2', password='testpassword123')

        # Categorías
        self.cat_global = Category.objects.create(name='Salud', user=None)
        self.cat_usertest1 = Category.objects.create(name='Comida', user=self.usertest1)
        self.cat_usertest2 = Category.objects.create(name='Ocio', user=self.usertest2)

        # Cliente API
        self.client = APIClient()

        # Gasto de usertest1
        self.expense_usertest1 = Expense.objects.create(
            category=self.cat_usertest1, user=self.usertest1, amount=50, date=date.today()
        )

# ------------------------ Tests de Categorias ------------------------
    # GET: Devuelve categorias de usuario logueado
    def test_category_list_authenticated(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)

        # Verificar el contenido de la respuesta 
        data = response.json() 
        category_names = [cat['name'] for cat in data]

        self.assertIn('Comida', category_names)
        self.assertIn('Salud', category_names)
        self.assertNotIn('Ocio', category_names)

    # GET: Devuelve categorias de usuario NO logueado
    def test_category_list_anonymous(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 403)

    # POST: Crear categoria nueva y unica desde usuario logueado
    def test_create_category_authenticated(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/categories/', {
            'name': 'Transporte'
        }, format='json')
        self.assertEqual(response.status_code, 201)

    # POST: Crear categoria nueva y NO unica desde usuario logueado
    def test_create_category_duplicate_user(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/categories/', {
            'name': 'Comida'
        }, format='json')
        self.assertEqual(response.status_code, 400)

    # POST: Crear categoria nueva y unica desde usuario NO logueado
    def test_create_category_anonymous(self):
        response = self.client.post('/api/categories/', {
            'name': 'Deporte'
        }, format='json')
        self.assertEqual(response.status_code, 403)

    # GET: Ver detalle de categoria de la que eres propietario
    def test_category_detail_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get(f'/api/categories/{self.cat_usertest1.id}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Comida')

    # GET: Ver detalle de categoria global
    def test_category_detail_global_user(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get(f'/api/categories/{self.cat_global.id}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Salud')

    # GET: Ver detalle de categoria de la que NO eres propietario
    def test_category_detail_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.get(f'/api/categories/{self.cat_usertest1.id}/')
        self.assertEqual(response.status_code, 403)

    # PUT: El propietario puede actualizar categoría de la que es propietario
    def test_category_update_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.patch(
            f'/api/categories/{self.cat_usertest1.id}/',
            {'name': 'ComidaModificada'},
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.cat_usertest1.refresh_from_db()
        self.assertEqual(self.cat_usertest1.name, 'ComidaModificada')

    # PUT: Otro usuario no puede actualizar categoría de la que NO es propietario
    def test_category_update_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.patch(
            f'/api/categories/{self.cat_usertest1.id}/',
            {'name': 'ComidaModificada'},
            format='json'
        )
        self.assertEqual(response.status_code, 403)

    # DELETE: El propietario puede eliminar categoría de la que es propietario
    def test_category_delete_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.delete(f'/api/categories/{self.cat_usertest1.id}/')
        self.assertEqual(response.status_code, 204)
        exists = Category.objects.filter(id=self.cat_usertest1.id).exists()
        self.assertFalse(exists)

    # DELETE: El propietario no puede eliminar categoría de la que NO es propietario
    def test_category_delete_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.delete(f'/api/categories/{self.cat_usertest1.id}/')
        self.assertEqual(response.status_code, 403)

    # DELETE: El propietario no puede eliminar categoría que NO existe
    def test_category_delete_nonexistent(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.delete('/api/categories/9999/')
        self.assertEqual(response.status_code, 404)


# ------------------------ Tests de Gastos ------------------------
    # GET: Devuelve gastos del usuario logueado
    def test_expense_list_authenticated(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get('/api/expenses/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['amount'], '50.00')

    # GET: No devuelve gastos del usuario no logueado
    def test_expense_list_anonymous(self):
        response = self.client.get('/api/expenses/')
        self.assertEqual(response.status_code, 403)

    # POST: Crea correctamente un gasto con categoria global
    def test_create_expense_global_category(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/expenses/', {
            'category': self.cat_global.id,
            'amount': 30,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 201)

    # POST: Crea correctamente un gasto con categoria propia
    def test_create_expense_own_category(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/expenses/', {
            'category': self.cat_usertest1.id,
            'amount': 25,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 201)

    # POST: No correctamente un gasto con categoria ajena
    def test_create_expense_other_user_category(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/expenses/', {
            'category': self.cat_usertest2.id,
            'amount': 25,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 400)

    # POST: No correctamente un gasto con importe menor de 0
    def test_create_expense_negative_amount(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/expenses/', {
            'category': self.cat_usertest1.id,
            'amount': -10,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 400)

    # POST: No correctamente un gasto con fecha futura
    def test_create_expense_future_date(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.post('/api/expenses/', {
            'category': self.cat_usertest1.id,
            'amount': 10,
            'date': str(date.today() + timedelta(days=5))
        }, format='json')

        self.assertEqual(response.status_code, 400)

    # POST: No puede crear gasto un usuario anónimo
    def test_create_expense_anonymous(self):
        response = self.client.post('/api/expenses/', {
            'category': self.cat_global.id,
            'amount': 20,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 403)       

    # GET: Obtiene el detalle de un gasto propio
    def test_get_expense_detail_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get(f'/api/expenses/{self.expense_usertest1.id}/')
        self.assertEqual(response.status_code, 200)

    # GET: No obtiene el detalle de un gasto ajeno
    def test_get_expense_detail_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.get(f'/api/expenses/{self.expense_usertest1.id}/')
        self.assertEqual(response.status_code, 403)

    # GET: No obtiene el detalle de un gasto que no existe
    def test_get_expense_detail_not_found(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.get('/api/expenses/9999/')
        self.assertEqual(response.status_code, 404)
    
    # PUT: Puede editar un gasto propio
    def test_update_expense_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.put(f'/api/expenses/{self.expense_usertest1.id}/', {
            'category': self.cat_usertest1.id,
            'amount': 100,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 200)

    # PUT: No puede editar un gasto ajeno
    def test_update_expense_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.put(f'/api/expenses/{self.expense_usertest1.id}/', {
            'category': self.cat_usertest1.id,
            'amount': 100,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 403)

    # PUT: No puede editar un gasto que no existe
    def test_update_expense_not_found(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.put('/api/expenses/9999/', {
            'category': self.cat_usertest1.id,
            'amount': 80,
            'date': str(date.today())
        }, format='json')

        self.assertEqual(response.status_code, 404)        

    # DELETE: Puede borrar un gasto propio
    def test_delete_expense_owner(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.delete(f'/api/expenses/{self.expense_usertest1.id}/')
        self.assertEqual(response.status_code, 204)

    # DELETE: No puede borrar un gasto ajeno
    def test_delete_expense_other_user(self):
        self.client.login(username='usertest2', password='testpassword123')
        response = self.client.delete(f'/api/expenses/{self.expense_usertest1.id}/')
        self.assertEqual(response.status_code, 403)

    # DELETE: No puede borrar un gasto que no existe
    def test_delete_expense_not_found(self):
        self.client.login(username='usertest1', password='testpassword123')
        response = self.client.delete('/api/expenses/9999/')
        self.assertEqual(response.status_code, 404)