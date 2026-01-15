from django.urls import path
from .views import CategoryListCreateAPIView, CategoryRetrieveUpdateDestroyAPIView, ExpenseListCreateAPIView, ExpenseRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('categories/', CategoryListCreateAPIView.as_view(), name='categories_list_create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category_detail'),
    path('expenses/', ExpenseListCreateAPIView.as_view(), name='expenses_list_create'),
    path('expenses/<int:pk>/', ExpenseRetrieveUpdateDestroyAPIView.as_view(), name='expense_detail'),
]
