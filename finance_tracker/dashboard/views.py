from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db.models import Sum, Value
from django.db.models.functions import ExtractMonth, Coalesce
from django.contrib.auth import get_user_model
from django.http import HttpResponse

from expenses.models import Expense
import pandas as pd


# ======================== DASHBOARD ========================

class ExpensesByCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(
                month=ExtractMonth("date"),
                category_name=Coalesce("category__name", Value("Sin categoría")),
            )
            .values("category_name", "month")
            .annotate(total=Coalesce(Sum("amount"), Value(0.0)))
            .order_by("month", "category_name")
        )

        return Response([
            {
                "category": e["category_name"],
                "month": e["month"],
                "total": float(e["total"]),
            }
            for e in qs
        ])


class ExpensesByMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth("date"))
            .values("month")
            .annotate(total=Coalesce(Sum("amount"), Value(0.0)))
            .order_by("month")
        )

        return Response([
            {
                "month": e["month"],
                "total": float(e["total"] or 0),
            }
            for e in qs
        ])


class LatestExpensesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .select_related("category")
            .order_by("-date")[:5]
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


class ExportExpensesExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user).select_related("category")

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
        return Response(list(
            Expense.objects
            .filter(user=request.user)
            .values("id", "category__name", "amount", "date")
        ))


class DebugAnnotatedMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(list(
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth("date"))
            .values("id", "category__name", "amount", "date", "month")
        ))


class DebugGroupByCategoryMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(
                month=ExtractMonth("date"),
                category_name=Coalesce("category__name", Value("Sin categoría")),
            )
            .values("category_name", "month")
            .annotate(total=Coalesce(Sum("amount"), 0))
            .order_by("month")
        )

        return Response(list(qs))


class DebugFieldTypesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        amount_field = Expense._meta.get_field("amount")
        income_field = User._meta.get_field("monthly_income")

        return Response({
            "expense_amount_field": amount_field.__class__.__name__,
            "monthly_income_field": income_field.__class__.__name__,
        })


class DebugSumTestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            result = Expense.objects.filter(
                user=request.user
            ).aggregate(total=Sum("amount"))

            return Response({
                "status": "OK",
                "total": result["total"],
                "type": str(type(result["total"])),
            })
        except Exception as e:
            return Response({
                "status": "ERROR",
                "error": str(e),
                "error_type": e.__class__.__name__,
            }, status=500)


class DebugInvalidAmountsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "null_amounts": list(
                Expense.objects.filter(amount__isnull=True)
                .values("id", "amount")
            ),
        })


class DebugSQLExpensesByMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Expense.objects
            .filter(user=request.user)
            .annotate(month=ExtractMonth("date"))
            .values("month")
            .annotate(total=Sum("amount"))
        )

        return Response({
            "sql": str(qs.query)
        })
