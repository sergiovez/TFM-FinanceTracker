from django.db import models
from users.models import CustomUser

# Modelo de categoria
class Category(models.Model):
    # user: si es null, la categoría es global; si no, es personalizada.
    name = models.CharField(max_length=50)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True,
        help_text="Si null, categoría global; si no, personalizada del usuario"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categorias"

    def __str__(self):
        return f"{self.name} ({'Global' if self.user is None else self.user.username})"

    # Devuelve la suma total de todos los gastos asociados a esta categoría
    def total_gastos(self):
        return self.expense_set.aggregate(total=models.Sum('amount'))['total'] or 0

# Modelo de gasto
class Expense(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Gastos"
    
    def __str__(self):
        return f"{self.user.username} - {self.category.name if self.category else 'Sin categoría'}: {self.amount}€"

    # Devuelve el total de gastos de un usuario específico
    @classmethod
    def total_gastos_usuario(cls, user):
        return cls.objects.filter(user=user).aggregate(total=models.Sum('amount'))['total'] or 0

    # Devuelve un diccionario con total de gasto por categoría de un usuario.
    @classmethod
    def gastos_por_categoria_usuario(cls, user):
        data = (
            cls.objects.filter(user=user)
            .values('category__name')
            .annotate(total=models.Sum('amount'))
            .order_by('category__name')
        )
        return {item['category__name']: item['total'] for item in data}