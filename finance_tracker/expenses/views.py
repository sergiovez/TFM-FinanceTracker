from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from .permissions import IsOwnerOrReadOnly

# ------------------------ Vistas de Categorias ------------------------
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    # GET: Lista categorías del usuario o globales
    def get_queryset(self):
        return Category.objects.filter(Q(user=self.request.user) | Q(user=None))

    # POST: Crea nueva categoría para el usuario logueado
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET: Detalle categoría
    # PUT: Edita categoría
    # DELETE: Elimina categoría
    def get_queryset(self):
        return Category.objects.all()

# ------------------------ Vistas de Gastos ------------------------
class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    # GET: Lista gastos del usuario logueado
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')
    
    # POST: Crea gasto para el usuario logueado
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET: Detalle de un gasto
    # PUT: Edita gasto
    # DELETE: Elimina gasto
    def get_queryset(self):
        return Expense.objects.all()
