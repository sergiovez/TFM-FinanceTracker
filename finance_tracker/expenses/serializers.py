from rest_framework import serializers
from django.utils.html import escape
# Para validar fechas
from datetime import date
# Importamos los modelos de la app
from .models import Category, Expense

# ------------------------ Serializador de Categorias ------------------------
class CategorySerializer(serializers.ModelSerializer):
    # Campo extra para indicar si la categoría es global (sin usuario)
    is_global = serializers.SerializerMethodField()

    class Meta:
        model = Category
        # Incluimos el nuevo campo is_global
        fields = ['id', 'name', 'is_global']
        read_only_fields = ['id', 'is_global']

    def get_is_global(self, obj):
        # Devuelve True si la categoría no tiene usuario
        return obj.user is None

    def validate_name(self, value):
        # Limpia HTML malicioso
        value = escape(value)
        # Obtenemos el request desde el contexto
        request = self.context.get('request')
        user = request.user if request else None

        # Evita categorías duplicadas por usuario
        if user and Category.objects.filter(name=value, user=user).exists():
            raise serializers.ValidationError("Ya existe una categoría con este nombre.")
        return value

# ------------------------ Serializador de Gastos ------------------------
class ExpenseSerializer(serializers.ModelSerializer):
    # Permite devolver el nombre de la categoría directamente
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
    
    # Limpia descripción
    def validate_description(self, value):
        return escape(value)

    # Valida que la categioria es global o pertenece al usuario
    def validate(self, attrs):
        user = self.context['request'].user
        category = attrs.get('category')
        if category.user is not None and category.user != user:
            raise serializers.ValidationError("La categoría no pertenece al usuario")
        return attrs
