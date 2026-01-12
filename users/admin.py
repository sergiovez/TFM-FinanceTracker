from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from expenses.models import Category, Expense

# Admin personalizado para CustomUser
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Información financiera', {'fields': ('monthly_income',)}),
    )
    list_display = ('username', 'email', 'is_staff', 'monthly_income')

# Registro de modelos de gastos y categorías
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'amount', 'date', 'created_at')
    list_filter = ('category', 'date')
    search_fields = ('user__username',)
