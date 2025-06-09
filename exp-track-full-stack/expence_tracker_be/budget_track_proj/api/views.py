from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .pagination import CustomTransactionPagination
from . models import Category, Transaction, MonthlyBudget
from datetime import date
from django.db.models import Sum
from .serializers import CategorySerializer, TransactionSerializer, MonthlyBudgetSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user = self.request.user)

    def perform_create(self, serializers):
        serializers.save(user = self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomTransactionPagination


    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(user=user)

        category = self.request.query_params.get('category')
        type_ = self.request.query_params.get('type')
        amount_gte = self.request.query_params.get('amount__gte')
        amount_lte = self.request.query_params.get('amount__lte')

        if category:
            queryset = queryset.filter(category=category)
        if type_:
            queryset = queryset.filter(type=type_)
        if amount_gte:
            queryset = queryset.filter(amount__gte=amount_gte)
        if amount_lte:
            queryset = queryset.filter(amount__lte=amount_lte)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = MonthlyBudget.objects.all()
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return MonthlyBudget.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def summary_view(request):
    user = request.user
    today = date.today()
    month = today.month
    year = today.year

    #get income
    income = Transaction.objects.filter(user = user, type = 'income', date__month = month,date__year = year).aggregate(Sum('amount'))['amount__sum'] or 0
    expenses = Transaction.objects.filter(user = user, type = 'expense', date__month = month,date__year = year).aggregate(Sum('amount'))['amount__sum'] or 0

    budge_obj = MonthlyBudget.objects.filter(user = user, month__year = year, month__month = month).first()
    budget = budge_obj.amount if budge_obj else 0

    return Response({
        'income':income,
        'expenses':expenses,
        'balance':budget,
        'budget_diff': budget - expenses
    })