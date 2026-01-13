from django.urls import path
from .views import CategoryListCreateAPIView, ExpenseListCreateAPIView, ExpenseRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('api/categories/', CategoryListCreateAPIView.as_view(), name='api_categories'),
    path('api/expenses/', ExpenseListCreateAPIView.as_view(), name='api_expenses'),
    path('api/expenses/<int:pk>/',ExpenseRetrieveUpdateDestroyAPIView.as_view(),name='api_expense_detail'
    ),
]
