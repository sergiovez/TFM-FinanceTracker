# Importa la función path para definir rutas
from django.urls import path
# Importamos todas las vistas del dashboard
from .views import (
    ExpensesByCategoryAPIView,
    ExpensesByMonthAPIView,
    LatestExpensesAPIView,
    IncomeSummaryAPIView,
    ExportExpensesExcelAPIView,
    DebugAllExpensesAPIView,
    DebugAnnotatedMonthAPIView,
    DebugGroupByCategoryMonthAPIView,
    DebugFieldTypesAPIView,
    DebugSumTestAPIView,
    DebugInvalidAmountsAPIView,
    DebugSQLExpensesByMonthAPIView,
)

urlpatterns = [
    path('expenses-by-category/', ExpensesByCategoryAPIView.as_view()),
    path('expenses-by-month/', ExpensesByMonthAPIView.as_view()),
    path('latest-expenses/', LatestExpensesAPIView.as_view()),
    path('income-summary/', IncomeSummaryAPIView.as_view()),
    path('export/excel/', ExportExpensesExcelAPIView.as_view()),
    path('debug/all-expenses/', DebugAllExpensesAPIView.as_view()),
    path('debug/annotated-month/', DebugAnnotatedMonthAPIView.as_view()),
    path('debug/groupby-category-month/', DebugGroupByCategoryMonthAPIView.as_view()), 
    path("debug/field-types/", DebugFieldTypesAPIView.as_view()),
    path("debug/sum-test/", DebugSumTestAPIView.as_view()),
    path("debug/invalid-amounts/", DebugInvalidAmountsAPIView.as_view()),
    path("debug/sql-expenses-by-month/", DebugSQLExpensesByMonthAPIView.as_view()), 
]