from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_details', 'body', 'created_at']
        read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    destination_name = serializers.ReadOnlyField(source='destination.name')

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_details', 'title', 'body', 'image', 'category', 'destination', 'destination_name',
            'likes_count', 'comments_count', 'is_liked', 'created_at'
        ]
        read_only_fields = ['author']

    def get_likes_count(self, obj):
        return obj.likes.count()
        
    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.likes.all()
        return False
