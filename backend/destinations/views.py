from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.http import Http404

from .models import Destination, Hotel
from .serializers import DestinationListSerializer, DestinationDetailSerializer, HotelSerializer

class DestinationPagination(PageNumberPagination):
    page_size = 9

class DestinationListView(generics.ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationListSerializer
    pagination_class = DestinationPagination
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country', 'city', 'category']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.lower())
        return queryset

class DestinationDetailView(generics.RetrieveAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationDetailSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        # Try finding by slug first (default)
        try:
            return Destination.objects.get(slug=lookup_value)
        except Destination.DoesNotExist:
            # If not found by slug, try by ID if it's a valid UUID
            try:
                import uuid
                uuid.UUID(lookup_value)
                return Destination.objects.get(id=lookup_value)
            except (ValueError, Destination.DoesNotExist, ImportError):
                raise Http404("No Destination matches the given query.")

class FeaturedDestinationsView(generics.ListAPIView):
    serializer_class = DestinationListSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Destination.objects.filter(is_featured=True)[:6]

class SaveToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        try:
            destination = Destination.objects.get(slug=slug)
        except Destination.DoesNotExist:
            return Response({'detail': 'Destination not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user in destination.saved_by.all():
            request.user.saved_destinations.remove(destination)
            is_saved = False
        else:
            request.user.saved_destinations.add(destination)
            is_saved = True

        return Response({'is_saved': is_saved}, status=status.HTTP_200_OK)

class HotelListView(generics.ListAPIView):
    serializer_class = HotelSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = Hotel.objects.select_related('destination')
        if dest := self.request.query_params.get('destination'):
            qs = qs.filter(destination_id=dest)
        if min_p := self.request.query_params.get('min_price'):
            qs = qs.filter(price_per_night__gte=min_p)
        if max_p := self.request.query_params.get('max_price'):
            qs = qs.filter(price_per_night__lte=max_p)
        if star := self.request.query_params.get('star_rating'):
            qs = qs.filter(star_rating=star)
        return qs
