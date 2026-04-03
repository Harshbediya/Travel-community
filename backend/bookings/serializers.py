from rest_framework import serializers
from django.utils import timezone
from .models import HotelBooking, TripBooking, UnifiedBooking
from destinations.serializers import HotelSerializer, DestinationListSerializer
from users.serializers import UserSerializer

class HotelBookingSerializer(serializers.ModelSerializer):
    hotel_details = HotelSerializer(source='hotel', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = HotelBooking
        fields = [
            'id', 'user', 'user_details', 'hotel', 'hotel_details', 'check_in', 'check_out', 
            'guests', 'total_price', 'status', 'booking_reference', 'created_at'
        ]
        read_only_fields = ['user', 'total_price', 'booking_reference', 'created_at']

    def validate(self, data):
        hotel = data['hotel']
        if not hotel.is_available:
            raise serializers.ValidationError("This hotel is currently not available for bookings.")
        
        # Check if dates are valid
        if data['check_in'] < timezone.now().date():
            raise serializers.ValidationError("Check-in date cannot be in the past.")
        if data['check_in'] >= data['check_out']:
            raise serializers.ValidationError("Check-out must be after check-in.")
        
        # Check overlapping bookings (simplified)
        overlapping_bookings = HotelBooking.objects.filter(
            hotel=hotel,
            status='confirmed',
            check_in__lt=data['check_out'],
            check_out__gt=data['check_in']
        ).count()
        
        if overlapping_bookings >= hotel.total_rooms:
            raise serializers.ValidationError("No rooms available for the selected dates.")
            
        return data

class TripBookingSerializer(serializers.ModelSerializer):
    destination_details = DestinationListSerializer(source='destination', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = TripBooking
        fields = [
            'id', 'user', 'user_details', 'destination', 'destination_details', 'travel_date', 
            'return_date', 'travelers', 'total_price', 'status', 
            'booking_reference', 'created_at'
        ]
        read_only_fields = ['user', 'total_price', 'booking_reference', 'created_at']

    def validate(self, data):
        if data['travel_date'] < timezone.now().date():
            raise serializers.ValidationError("Travel date cannot be in the past.")
        if data['travel_date'] >= data['return_date']:
            raise serializers.ValidationError("Return date must be after travel date.")
        return data

class UnifiedBookingSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    destination_details = DestinationListSerializer(source='destination', read_only=True)
    hotel_details = HotelSerializer(source='hotel', read_only=True)

    class Meta:
        model = UnifiedBooking
        fields = [
            'id', 'user', 'user_details', 'destination', 'destination_details', 
            'hotel', 'hotel_details', 'start_date', 'end_date', 'travelers', 
            'transport_details', 'add_ons', 'travelers_info', 'total_price', 
            'status', 'booking_reference', 'payment_method', 'created_at'
        ]
        read_only_fields = ['user', 'booking_reference', 'created_at']
