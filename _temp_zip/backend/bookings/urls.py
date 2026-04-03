from django.urls import path
from .views import (
    HotelBookingListCreateView, HotelBookingDetailView,
    TripBookingListCreateView, TripBookingDetailView,
    UnifiedBookingListCreateView, UnifiedBookingDetailView
)

urlpatterns = [
    path('bookings/unified/', UnifiedBookingListCreateView.as_view(), name='unified-booking-list-create'),
    path('bookings/unified/<uuid:pk>/', UnifiedBookingDetailView.as_view(), name='unified-booking-detail'),
    path('bookings/hotels/', HotelBookingListCreateView.as_view(), name='hotel-booking-list-create'),
    path('bookings/hotels/<uuid:pk>/', HotelBookingDetailView.as_view(), name='hotel-booking-detail'),
    path('bookings/trips/', TripBookingListCreateView.as_view(), name='trip-booking-list-create'),
    path('bookings/trips/<uuid:pk>/', TripBookingDetailView.as_view(), name='trip-booking-detail'),
]
