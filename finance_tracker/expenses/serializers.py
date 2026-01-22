from rest_framework import serializers
from django.utils.html import escape
from datetime import date
from .models import Category, Expense

# ------------------------ Serializador de Categorias ------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['id']

    # Evita duplicados de categoria para un usuario
    def validate_name(self, value):
        value = escape(value)
        request = self.context.get('request')
        user = request.user if request else None

        if user and Category.objects.filter(name=value, user=user).exists():
            raise serializers.ValidationError("Ya existe una categoría con este nombre.")
        return value

# ------------------------ Serializador de Gastos ------------------------
class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'description', 'date', 'category', 'category_name']
        read_only_fields = ['id', 'category_name']

    # Valida que no introduces cantidad negativa
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("El importe debe ser mayor que cero.")
        return value

    # Valida que no introduces una fecha futura
    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("No puede ser una fecha futura.")
        return value
    
    def validate_description(self, value):
        return escape(value)

    # Valida que la categioria es global o pertenece al usuario
    def validate(self, attrs):
        user = self.context['request'].user
        category = attrs.get('category')
        if category.user is not None and category.user != user:
            raise serializers.ValidationError("La categoría no pertenece al usuario")
        return attrs
