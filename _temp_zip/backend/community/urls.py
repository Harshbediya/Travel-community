from django.urls import path
from .views import (
    PostListCreateView, PostDetailView,
    LikeToggleView, CommentListCreateView
)

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<uuid:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<uuid:pk>/like/', LikeToggleView.as_view(), name='like-toggle'),
    path('posts/<uuid:pk>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
]
