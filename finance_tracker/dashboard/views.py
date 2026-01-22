from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from expenses.models import Expense
from django.http import HttpResponse
import pandas as pd

# Devuelve un listado de gastos agrupados por categoría y mes.
class ExpensesByCategoryAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .extra(select={'month': "strftime('%%m', date)"})
            .values('category__name', 'month')
            .annotate(total=Sum('amount'))
        )
        # Lo convertimos en lista de diccionarios
        data = [
            {
                'category': e['category__name'], 
                'month': e['month'],
                'total': e['total']
            }
            for e in expenses
        ]
        return Response(data)

# Devuelve un listado de gastos totales por mes del usuario.
class ExpensesByMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .extra(select={'month': "strftime('%%m', date)"})
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )
        return Response(expenses)

# Devuelve los 5 últimos gastos del usuario
class LatestExpensesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user)
            .order_by('-date')[:5]
        )
        data = [
            {
                'id': e.id,
                'category': e.category.name,
                'amount': e.amount,
                'date': e.date
            }
            for e in expenses
        ]
        return Response(data)

# Genera un archivo Excel con todos los gastos del usuario.
class ExportExpensesExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)
        data = [
            {
                'Category': e.category.name,
                'Amount': e.amount,
                'Date': e.date
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


# Devuelve resumen mensual:
    # income: ingreso mensual del usuario
    # expenses: total de gastos en el mes (o todos si month=all)
    # savings: income - expenses
class IncomeSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month = request.query_params.get("month")

        expenses = Expense.objects.filter(user=user)

        if month and month != "all":
            expenses = expenses.filter(date__month=int(month))

        expenses_total = expenses.aggregate(
            total=Sum("amount")
        )["total"] or 0

        income = user.monthly_income or 0

        return Response({
            "income": float(income),
            "expenses": float(expenses_total),
            "savings": float(income - expenses_total),
        })
