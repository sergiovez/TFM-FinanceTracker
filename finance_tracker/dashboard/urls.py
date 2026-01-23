# Importa la función path para definir rutas
from django.urls import path
# Importamos todas las vistas del dashboard
from .views import (
    ExpensesByCategoryAPIView,
    ExpensesByMonthAPIView,
    LatestExpensesAPIView,
    IncomeSummaryAPIView,
    ExportExpensesExcelAPIView,
)

urlpatterns = [
    path('expenses-by-category/', ExpensesByCategoryAPIView.as_view()),
    path('expenses-by-month/', ExpensesByMonthAPIView.as_view()),
    path('latest-expenses/', LatestExpensesAPIView.as_view()),
    path('income-summary/', IncomeSummaryAPIView.as_view()),
    path('export/excel/', ExportExpensesExcelAPIView.as_view()),
]
