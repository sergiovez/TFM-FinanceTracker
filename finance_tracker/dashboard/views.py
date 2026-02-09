# Vista base de DRF para APIs personalizadas
from rest_framework.views import APIView
# Respuesta estándar de DRF (JSON)
from rest_framework.response import Response
# Permiso para exigir autenticación
from rest_framework.permissions import IsAuthenticated

# Funciones ORM
from django.db.models import Sum, Value
from django.db.models.functions import ExtractMonth, Coalesce

# Modelo de gastos
from expenses.models import Expense

# Respuesta HTTP clásica
from django.http import HttpResponse

# Librería para trabajar con Excel
import pandas as pd

# ------------------------ Gastos por categoría y mes ------------------------
class ExpensesByCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth('date'))  
            .annotate(category_name=Coalesce('category__name', Value('Sin categoría')))  
            .values('category_name', 'month')
            .annotate(total=Coalesce(Sum('amount'), 0))  
            .order_by('month', 'category_name')
        )

        data = [
            {
                'category': e['category_name'],
                'month': e['month'],
                'total': float(e['total']),
            }
            for e in expenses
        ]

        return Response(data)


# ------------------------ Gastos por mes ------------------------
class ExpensesByMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth('date')) 
            .values('month')
            .annotate(total=Coalesce(Sum('amount'), 0))  
            .order_by('month')
        )

        return Response([
            {
                'month': e['month'],
                'total': float(e['total']),
            }
            for e in expenses
        ])


# ------------------------ Últimos gastos ------------------------
class LatestExpensesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .select_related('category') 
            .order_by('-date')[:5]
        )

        data = [
            {
                'id': e.id,
                'category': e.category.name if e.category else 'Sin categoría', 
                'amount': float(e.amount),
                'date': e.date,
            }
            for e in expenses
        ]

        return Response(data)


# ------------------------ Exportar a Excel ------------------------
class ExportExpensesExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user).select_related('category')

        data = [
            {
                'Category': e.category.name if e.category else 'Sin categoría',
                'Amount': float(e.amount),
                'Date': e.date,
            }
            for e in expenses
        ]

        df = pd.DataFrame(data)

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=expenses.xlsx'

        df.to_excel(response, index=False)

        return response


# ------------------------ Resumen de ingresos ------------------------
class IncomeSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month = request.query_params.get("month")

        expenses = Expense.objects.filter(user=user)

        if month and month != "all":
            expenses = expenses.filter(date__month=int(month))

        expenses_total = expenses.aggregate(
            total=Coalesce(Sum("amount"), 0)
        )["total"]

        income = user.monthly_income or 0

        return Response({
            "income": float(income),
            "expenses": float(expenses_total),
            "savings": float(income - expenses_total),
        })
