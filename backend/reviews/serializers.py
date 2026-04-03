from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_details', 'destination', 'rating', 'title', 'body', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate(self, data):
        request = self.context.get('request')
        if not request:
            return data
            
        user = request.user
        destination = data.get('destination')
        
        if Review.objects.filter(user=user, destination=destination).exists():
            raise serializers.ValidationError("You have already reviewed this destination.")
            
        return data
