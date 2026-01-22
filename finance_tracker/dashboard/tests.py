from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from expenses.models import Expense, Category
from datetime import date

User = get_user_model()

# ------------------------ Tests del Dashboard ------------------------
class DashboardAPITestCase(TestCase):
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

        self.client.login(username='usertest1', password='testpassword123')

    def test_expenses_by_category(self):
        response = self.client.get('/api/dashboard/expenses-by-category/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]['category'], 'Comida')
        self.assertEqual(data[0]['total'], 80)

    def test_expenses_by_month(self):
        response = self.client.get('/api/dashboard/expenses-by-month/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data) > 0)
        self.assertIn('total', data[0])
        self.assertIn('month', data[0])

    def test_latest_expenses(self):
        response = self.client.get('/api/dashboard/latest-expenses/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['amount'], 50)

    def test_export_expenses_excel(self):
        response = self.client.get('/api/dashboard/export/excel/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response['Content-Disposition'],
            'attachment; filename=expenses.xlsx'
        )
