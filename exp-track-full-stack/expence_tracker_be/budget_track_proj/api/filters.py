from django.db.models import Q

from .models import Transaction

def get_queryset(self):
    user = self.request.user
    queryset = Transaction.objects.filter(user=user)

    category = self.request.query_params.get('category')
    amount_gte = self.request.query_params.get('amount__gte')
    date_lte = self.request.query_params.get('date__lte')

    if category:
        queryset = queryset.filter(category=category)

    if amount_gte:
        queryset = queryset.filter(amount__gte=amount_gte)

    if date_lte:
        queryset = queryset.filter(date__lte=date_lte)

    return queryset