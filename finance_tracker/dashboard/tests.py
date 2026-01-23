# Importa la clase base para tests de Django
from django.test import TestCase
# Cliente HTTP de prueba
from rest_framework.test import APIClient
# Devuelve el CustomUser no el User por defecto
from django.contrib.auth import get_user_model
# Importa los modelos de gastos y categorías de la app expenses
from expenses.models import Expense, Category
# Para validar fechas
from datetime import date

# Obtenemos el modelo de usuario configurado en el proyecto
User = get_user_model()

# ------------------------ Tests del Dashboard ------------------------
class DashboardAPITestCase(TestCase):
    # Este método se ejecuta antes de cada test
    def setUp(self):
        # Usuarios
        self.usertest1 = User.objects.create_user(username='usertest1', password='testpassword123')
        self.usertest2 = User.objects.create_user(username='usertest2', password='testpassword123')

        # Categorías
        self.cat_global = Category.objects.create(name='Salud', user=None)
        self.cat_usertest1_1 = Category.objects.create(name='Comida', user=self.usertest1)
        self.cat_usertest1_2 = Category.objects.create(name='Deporte', user=self.usertest1)
        self.cat_usertest2 = Category.objects.create(name='Ocio', user=self.usertest2)

        # Gasto de usertest1
        self.expense1_usertest1 = Expense.objects.create(
            category=self.cat_usertest1_1, user=self.usertest1, amount=50, date=date.today()
        )
        self.expense2_usertest1 = Expense.objects.create(
            category=self.cat_usertest1_1, user=self.usertest1, amount=30, date=date.today()
        )
        self.expense3_usertest1 = Expense.objects.create(
            category=self.cat_usertest1_2, user=self.usertest1, amount=40, date=date.today()
        )
        self.expense1_usertest2 = Expense.objects.create(
            category=self.cat_usertest2, user=self.usertest2, amount=10, date=date.today()
        )
        
        # Cliente API
        self.client = APIClient()
        # Autenticamos al usuario principal para todas las pruebas
        self.client.login(username='usertest1', password='testpassword123')

    # Comprueba que el endpoint agrupa correctamente los gastos por categoría.
    def test_expenses_by_category(self):
        response = self.client.get('/api/dashboard/expenses-by-category/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]['category'], 'Comida')
        self.assertEqual(data[0]['total'], 80)

    # Comprueba que el endpoint devuelve gastos agrupados por mes.
    def test_expenses_by_month(self):
        response = self.client.get('/api/dashboard/expenses-by-month/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data) > 0)
        self.assertIn('total', data[0])
        self.assertIn('month', data[0])

    # Comprueba que se devuelven los últimos gastos del usuario.
    def test_latest_expenses(self):
        response = self.client.get('/api/dashboard/latest-expenses/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['amount'], 50)

    # Comprueba que el endpoint devuelve un archivo Excel.
    def test_export_expenses_excel(self):
        response = self.client.get('/api/dashboard/export/excel/')
        self.assertEqual(response.status_code, 200)
        # Verificamos que el navegador lo trate como descarga
        self.assertEqual(
            response['Content-Disposition'],
            'attachment; filename=expenses.xlsx'
        )
