from rest_framework import serializers
from datetime import date
from .models import Category, Expense

# Serializer para el modelo Category. Se encarga de convertir categorías a JSON y validar duplicados por usuario.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['id']

    # Evita que un usuario cree dos categorías con el mismo nombre.
    def validate_name(self, value):
        request = self.context.get('request')
        user = request.user if request else None

        if user and Category.objects.filter(
            name=value,
            user=user
        ).exists():
            raise serializers.ValidationError(
                "Ya existe una categoría con este nombre."
            )

        return value

# Serializer para el modelo Expense. Incluye validaciones de importe y fecha.
class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = Expense
        fields = [
            'id',
            'amount',
            'description',
            'date',
            'category',
            'category_name'
        ]
        read_only_fields = ['id']

    # El importe del gasto debe ser mayor que cero.
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El importe debe ser mayor que cero."
            )
        return value

    # La fecha debe ser una fecha pasada
    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError(
                "La fecha no puede ser futura."
            )
        return value
