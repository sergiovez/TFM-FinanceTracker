# Importa la funcionalidad de administración de Django
from django.contrib import admin 
# Importa la clase base UserAdmin para personalizar la administración de usuarios
from django.contrib.auth.admin import UserAdmin
# Importa tu modelo de usuario personalizado
from .models import CustomUser
# Importa los modelos de gastos y categorías de la app expenses
from expenses.models import Category, Expense

# ==========================
# Admin personalizado para CustomUser
# ==========================

@admin.register(CustomUser) 
class CustomUserAdmin(UserAdmin):
    # Define cómo se muestran los campos en el formulario de edición de usuarios
    fieldsets = UserAdmin.fieldsets + (
        ('Información financiera', {'fields': ('monthly_income',)}),
    )
     # Define las columnas que se muestran en la lista de usuarios en el panel de admin
    list_display = ('username', 'email', 'is_staff', 'monthly_income')


# ==========================
# Registro de modelo Category en el admin
# ==========================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # Columnas que se mostrarán en la lista de categorías
    list_display = ('name', 'user', 'created_at')
    # Campos que se pueden buscar mediante la barra de búsqueda del admin
    search_fields = ('name', 'user__username')


# ==========================
# Registro de modelo Expense en el admin
# ==========================

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    # Columnas que se mostrarán en la lista de gastos
    list_display = ('user', 'category', 'amount', 'date', 'created_at')
    # Permite filtrar la lista de gastos
    list_filter = ('category', 'date')
    # Campos que se pueden buscar mediante la barra de búsqueda del admin
    search_fields = ('user__username',)
