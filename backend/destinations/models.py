import uuid
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

class Destination(models.Model):    
    CATEGORY_CHOICES = (
        ('beach', 'Beach'),
        ('mountain', 'Mountain'),
        ('city', 'City'),
        ('cultural', 'Cultural'),
        ('adventure', 'Adventure'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    featured_image = CloudinaryField('image', blank=True, null=True)
    avg_rating = models.FloatField(default=0)
    total_reviews = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=5000.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.country}"

class DestinationImage(models.Model):
    destination = models.ForeignKey(Destination, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image')
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-is_primary']

    def __str__(self):
        return f"Image for {self.destination.name}"

class Hotel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=255, blank=True)
    featured_image = CloudinaryField('image', blank=True, null=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    star_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    amenities = models.JSONField(default=list, blank=True)
    total_rooms = models.IntegerField(default=10)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.destination.city}"
