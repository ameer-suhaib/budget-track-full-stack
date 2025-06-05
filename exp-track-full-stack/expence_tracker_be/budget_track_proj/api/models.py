from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Category(models.Model):
    CATEGORY_TYPE_CHOICE = (
        ('income','Income'),
        ('expense','Expense'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPE_CHOICE)


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICE = (
        ('income','Income'),
        ('expense','Expense'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    date = models.DateField(default=timezone.now)
    type = models.CharField(max_length=10,choices=TRANSACTION_TYPE_CHOICE)
    note = models.TextField(blank=True)


class MonthlyBudget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()

    class Meta:
        unique_together = ('user', 'month')
