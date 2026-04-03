import uuid
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    destination = models.ForeignKey('destinations.Destination', on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=100)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'destination')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.email} for {self.destination.name}"

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_destination_stats(sender, instance, **kwargs):
    destination = instance.destination
    stats = Review.objects.filter(destination=destination).aggregate(
        avg_rating=Avg('rating'),
        total_reviews=Count('id')
    )
    destination.avg_rating = stats['avg_rating'] or 0.0
    destination.total_reviews = stats['total_reviews'] or 0
    destination.save(update_fields=['avg_rating', 'total_reviews'])
