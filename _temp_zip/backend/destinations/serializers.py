from rest_framework import serializers
from .models import Destination, DestinationImage, Hotel

class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = ['id', 'image', 'is_primary', 'order']

class DestinationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'country', 'city', 'category',
            'featured_image', 'avg_rating', 'total_reviews',
            'is_featured', 'base_price'
        ]

class DestinationDetailSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'country', 'city', 'description', 'category',
            'featured_image', 'avg_rating', 'total_reviews', 'is_featured',
            'base_price', 'images', 'is_saved', 'created_at', 'updated_at'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.saved_destinations.filter(id=obj.id).exists()
        return False

class HotelSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    
    class Meta:
        model = Hotel
        fields = [
            'id', 'destination', 'destination_name', 'name', 'description', 
            'address', 'featured_image', 'price_per_night', 'star_rating', 
            'amenities', 'total_rooms', 'is_available'
        ]
