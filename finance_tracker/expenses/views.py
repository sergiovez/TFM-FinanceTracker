# Importa vistas genéricas de Django REST Framework
from rest_framework import generics
# Permiso que exige que el usuario esté autenticado
from rest_framework.permissions import IsAuthenticated
# Permite construir consultas complejas (OR, AND, etc.)
from django.db.models import Q
# Importamos los modelos de la app
from .models import Category, Expense
# Importamos los serializers
from .serializers import CategorySerializer, ExpenseSerializer
# Permiso personalizado: solo el dueño puede modificar
from .permissions import IsOwnerOrReadOnly
# Para devolver errores personalizados
from rest_framework.response import Response
from rest_framework import status

# ------------------------ Vistas de Categorias ------------------------
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    # Serializer que se usará para convertir Category ↔ JSON
    serializer_class = CategorySerializer
    # Solo usuarios autenticados pueden acceder
    permission_classes = [IsAuthenticated]

    # GET: Lista categorías del usuario o globales
    def get_queryset(self):
        return Category.objects.filter(Q(user=self.request.user) | Q(user=None))

    # POST: Crea nueva categoría para el usuario logueado
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    # Serializer que se usará para convertir Category ↔ JSON
    serializer_class = CategorySerializer
    # Requiere autenticación + permiso de propietario
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET: Detalle categoría
    # PUT: Edita categoría
    # DELETE: Elimina categoría
    def get_queryset(self):
        return Category.objects.all()

    # Bloqueamos edición y borrado de categorías globales
    def update(self, request, *args, **kwargs):
        category = self.get_object()

        if category.user is None:
            return Response(
                {"detail": "No se pueden modificar categorías globales"},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs, partial=True)

    # Sobrescribimos el borrado para evitar eliminar categorías con gastos
    # y también categorías globales
    def destroy(self, request, *args, **kwargs):
        category = self.get_object()

        # Bloqueamos eliminación de categorías globales
        if category.user is None:
            return Response(
                {"detail": "No se pueden eliminar categorías globales"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Comprobamos si existen gastos asociados a esta categoría
        if Expense.objects.filter(category=category).exists():
            return Response(
                {"detail": "No se puede eliminar la categoría porque tiene gastos asociados"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)

# ------------------------ Vistas de Gastos ------------------------
class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    # Serializer que se usará para convertir Category ↔ JSON
    serializer_class = ExpenseSerializer
    # Solo usuarios autenticados pueden acceder
    permission_classes = [IsAuthenticated]

    # GET: Lista gastos del usuario logueado
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')
    
    # POST: Crea gasto para el usuario logueado
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    # Serializer que se usará para convertir Category ↔ JSON
    serializer_class = ExpenseSerializer
    # Solo usuarios autenticados pueden acceder
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET: Detalle de un gasto
    # PUT: Edita gasto
    # DELETE: Elimina gasto
    def get_queryset(self):
        return Expense.objects.all()
