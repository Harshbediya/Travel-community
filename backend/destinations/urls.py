from django.urls import path
from .views import (
    DestinationListView, DestinationDetailView,
    FeaturedDestinationsView, SaveToggleView, HotelListView
)

urlpatterns = [
    path('destinations/featured/', FeaturedDestinationsView.as_view(), name='featured-destinations'),
    path('destinations/', DestinationListView.as_view(), name='destination-list'),
    path('destinations/<str:slug>/', DestinationDetailView.as_view(), name='destination-detail'),
    path('destinations/<str:slug>/save/', SaveToggleView.as_view(), name='save-toggle'),
    path('hotels/', HotelListView.as_view(), name='hotel-list'),
]
