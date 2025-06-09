from rest_framework import serializers
from . import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'
        read_only_fields = ['user']

class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=models.Category.objects.all())
    category_name = serializers.SerializerMethodField()
    class Meta:
        model = models.Transaction
        fields = '__all__'
        read_only_fields = ['user']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MonthlyBudget
        fields = '__all__'
        read_only_fields = ['user']

    def validate(self, data):
        user = self.context['request'].user
        month = data.get('month')
        if models.MonthlyBudget.objects.filter(user=user, month=month).exists():
            raise serializers.ValidationError("Budget for this month already exists.")
