import uuid
from django.db import models
from cloudinary.models import CloudinaryField

class Post(models.Model):
    CATEGORY_CHOICES = (
        ('photos', 'Photos'),
        ('stories', 'Stories'),
        ('tips', 'Tips'),
        ('reviews', 'Reviews'),
        ('general', 'General'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='post_set')
    title = models.CharField(max_length=200)
    body = models.TextField()
    image = CloudinaryField('image', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    destination = models.ForeignKey('destinations.Destination', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    likes = models.ManyToManyField('users.User', related_name='liked_posts', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"
