from rest_framework import serializers
from . import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'
        read_only_fields = ['user']

class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    class Meta:
        model = models.Transaction
        fields = '__all__'
        read_only_fields = ['user']

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MonthlyBudget
        fields = '__all__'
        read_only_fields = ['user']
