from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from .permissions import IsOwnerOrReadOnly

# API para listar y crear categorías del usuario autenticado.------> /API/categories
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    # GET -> Devuelve categorias del usuario
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user) | Category.objects.filter(user=None)

    # POST -> Asigna el usuario al crear la categoria
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# API para ver, editar o eliminar categorias del usuario autenticado.------> /API/categories/id
class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET -> Devuelve categorias del usuario
    def get_queryset(self):
        return Category.objects.all()

# API para listar y crear gastos del usuario autenticado.------> /API/expenses
class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    # GET -> Devuelve gastos del usuario y ordenados por fecha
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')
    
    # POST -> Asigna el usuario al crear el gasto
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# API para ver, editar o eliminar gastos del usuario autenticado.------> /API/expenses/id
class ExpenseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # GET -> Devuelve gastos del usuario
    def get_queryset(self):
        return Expense.objects.all()

