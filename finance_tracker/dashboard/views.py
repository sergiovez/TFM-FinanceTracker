from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db.models import Sum, Value
from django.db.models.functions import ExtractMonth, Coalesce

from expenses.models import Expense
from django.http import HttpResponse

import pandas as pd


# ------------------------ Gastos por categoría y mes ------------------------
class ExpensesByCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(
                month=ExtractMonth('date'),
                category_name=Coalesce('category__name', Value('Sin categoría'))
            )
            .values('category_name', 'month')
            .annotate(total=Coalesce(Sum('amount'), 0))
            .order_by('month', 'category_name')
        )

        return Response([
            {
                "category": e["category_name"],
                "month": e["month"],
                "total": float(e["total"]),
            }
            for e in qs
        ])


# ------------------------ Gastos por mes ------------------------
class ExpensesByMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        raise Exception("ESTE ES EL VIEWS NUEVO")
    
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth('date'))
            .values('month')
            .annotate(total=Coalesce(Sum('amount'), 0))
            .order_by('month')
        )

        return Response([
            {
                "month": e["month"],
                "total": float(e["total"]),
            }
            for e in qs
        ])


# ------------------------ Últimos gastos ------------------------
class LatestExpensesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .select_related('category')
            .order_by('-date')[:5]
        )

        return Response([
            {
                "id": e.id,
                "category": e.category.name if e.category else "Sin categoría",
                "amount": float(e.amount),
                "date": e.date,
            }
            for e in qs
        ])


# ------------------------ Exportar a Excel ------------------------
class ExportExpensesExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user).select_related('category')

        data = [
            {
                "Category": e.category.name if e.category else "Sin categoría",
                "Amount": float(e.amount),
                "Date": e.date,
            }
            for e in expenses
        ]

        df = pd.DataFrame(data)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = "attachment; filename=expenses.xlsx"

        df.to_excel(response, index=False)
        return response


# ------------------------ Resumen de ingresos ------------------------
class IncomeSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get("month")

        qs = Expense.objects.filter(user=request.user)

        if month and month != "all":
            qs = qs.filter(date__month=int(month))

        total_expenses = qs.aggregate(
            total=Coalesce(Sum("amount"), 0)
        )["total"]

        income = request.user.monthly_income or 0

        return Response({
            "income": float(income),
            "expenses": float(total_expenses),
            "savings": float(income - total_expenses),
        })


# ======================== DEBUG ========================

class DebugAllExpensesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Expense.objects.filter(user=request.user)
        return Response(list(
            qs.values('id', 'category__name', 'amount', 'date')
        ))


class DebugAnnotatedMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth('date'))
        )
        return Response(list(
            qs.values('id', 'category__name', 'amount', 'date', 'month')
        ))


class DebugGroupByCategoryMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(
                month=ExtractMonth('date'),
                category_name=Coalesce('category__name', Value('Sin categoría'))
            )
            .values('category_name', 'month')
            .annotate(total=Coalesce(Sum('amount'), 0))
            .order_by('month')
        )

        return Response(list(qs))
