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
