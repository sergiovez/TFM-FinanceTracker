# Vista base de DRF para APIs personalizadas
from rest_framework.views import APIView
# Respuesta estándar de DRF (JSON)
from rest_framework.response import Response
# Permiso para exigir autenticación
from rest_framework.permissions import IsAuthenticated
# Función para sumar campos en consultas
from django.db.models import Sum
# Modelo de gastos
from expenses.models import Expense
# Respuesta HTTP clásica
from django.http import HttpResponse
# Librería para trabajar con Excel
import pandas as pd

# ------------------------ Gastos por categoría y mes ------------------------
class ExpensesByCategoryAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        # Devuelve los gastos agrupados
        expenses = (
            Expense.objects
            .filter(user=request.user) # Solo gastos del usuario logueado
            .extra(select={'month': "strftime('%%m', date)"}) # Extraemos el mes de la fecha
            .values('category__name', 'month') # Indicamos los campos por los que agrupamos
            .annotate(total=Sum('amount')) # Sumamos el importe de cada grupo
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

# ------------------------ Gastos por mes ------------------------
class ExpensesByMonthAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user) # Solo gastos del usuario logueado
            .extra(select={'month': "strftime('%%m', date)"}) # Extraemos el mes de la fecha
            .values('month')
            .annotate(total=Sum('amount')) # Sumamos el importe de cada grupo
            .order_by('month') # Ordenamos los gastos por mes
        )
        return Response(expenses)

# ------------------------ Últimos gastos ------------------------
class LatestExpensesAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (
            Expense.objects
            .filter(user=request.user) # Solo gastos del usuario logueado
            .order_by('-date')[:5] # Ultimos cinco gastos
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

# ------------------------ Exportar a Excel ------------------------
class ExportExpensesExcelAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtenemos los gastos del usuario
        expenses = Expense.objects.filter(user=request.user) 
        # Convertimos los gastos en una lista de diccionarios
        data = [
            {
                'Category': e.category.name,
                'Amount': e.amount,
                'Date': e.date
            }
            for e in expenses
        ]
        # Convertimos los gastos en una lista de diccionarios
        df = pd.DataFrame(data)
        # Creamos un DataFrame de pandas
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        # Indicamos al navegador que es un archivo descargable
        response['Content-Disposition'] = 'attachment; filename=expenses.xlsx'
        # Escribimos el Excel directamente en la respuesta
        df.to_excel(response, index=False)
        return response


# ------------------------ Resumen de ingresos ------------------------
    # income: ingreso mensual del usuario
    # expenses: total de gastos en el mes (o todos si month=all)
    # savings: income - expenses
class IncomeSummaryAPIView(APIView):
    # Solo usuarios autenticados
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Obtienes el mes
        month = request.query_params.get("month")
        # Todos los gastos del usuario
        expenses = Expense.objects.filter(user=user)

        if month and month != "all":
            expenses = expenses.filter(date__month=int(month))

        expenses_total = expenses.aggregate(
            total=Sum("amount")
        )["total"] or 0

        # Ingreso mensual del usuario
        income = user.monthly_income or 0

        return Response({
            "income": float(income),
            "expenses": float(expenses_total),
            "savings": float(income - expenses_total),
        })
