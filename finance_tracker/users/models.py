# Importamos el modelo base de usuario que trae Django
# AbstractUser incluye username, password, email, permisos, etc.
from django.contrib.auth.models import AbstractUser
# Importamos el sistema de modelos de Django
from django.db import models

# Modelo de usuario extendido.
class CustomUser(AbstractUser):
    # monthly_income: ingreso mensual opcional del usuario, usado para análisis
    monthly_income = models.DecimalField(
        max_digits=10, decimal_places=2, 
        null=True, blank=True,
        help_text="Ingreso mensual opcional del usuario para contextualizar gastos"
    )

    def __str__(self):
        return self.username

    # Devuelve la suma total de gastos del usuario
    def total_gastos(self):
        from expenses.models import Expense
        return self.expense_set.aggregate(total=models.Sum('amount'))['total'] or 0

    # Devuelve un diccionario con total de gasto por categoría.
    def gasto_por_categoria(self):
        from expenses.models import Expense
        data = (
            self.expense_set.values('category__name')
            .annotate(total=models.Sum('amount'))
            .order_by('category__name')
        )
        return {item['category__name']: item['total'] for item in data}

    # Devuelve el porcentaje de gasto respecto al ingreso mensual
    def porcentaje_gasto_ingreso(self):
        if self.monthly_income and self.monthly_income > 0:
            return round((self.total_gastos() / self.monthly_income) * 100, 2)
        return None