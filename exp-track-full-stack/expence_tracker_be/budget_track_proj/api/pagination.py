from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomTransactionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'  # allow client to override
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "items": data,
            "metadata": {
                "total_items": self.page.paginator.count,
                "page_number": self.page.number,
                "page_size": self.get_page_size(self.request),
            }
        })
