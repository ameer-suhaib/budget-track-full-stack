from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, BudgetViewSet
from django.urls import path, include
from . views import summary_view
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'budget', BudgetViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('summary/', summary_view, name='summary')
]