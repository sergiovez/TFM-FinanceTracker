from django.urls import path
from .views import (
    ExpensesByCategoryAPIView,
    ExpensesByMonthAPIView,
    LatestExpensesAPIView,
    ExportExpensesExcelAPIView,
)

urlpatterns = [
    path('expenses-by-category/', ExpensesByCategoryAPIView.as_view()),
    path('expenses-by-month/', ExpensesByMonthAPIView.as_view()),
    path('latest-expenses/', LatestExpensesAPIView.as_view()),
    path('export/excel/', ExportExpensesExcelAPIView.as_view()),
]
