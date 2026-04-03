import uuid
from django.db import models

class HotelBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='hotel_bookings')
    hotel = models.ForeignKey('destinations.Hotel', on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_reference = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = 'BK' + uuid.uuid4().hex[:8].upper()
        
        if self.check_in and self.check_out and self.hotel:
            nights = (self.check_out - self.check_in).days
            if nights > 0:
                self.total_price = self.hotel.price_per_night * nights * self.guests
            else:
                self.total_price = 0
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.hotel.name} ({self.booking_reference})"

class TripBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='trip_bookings')
    destination = models.ForeignKey('destinations.Destination', on_delete=models.CASCADE, related_name='bookings')
    travel_date = models.DateField()
    return_date = models.DateField()
    travelers = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_reference = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = 'TR' + uuid.uuid4().hex[:8].upper()
        
        if self.travel_date and self.return_date and self.destination:
            days = (self.return_date - self.travel_date).days
            if days > 0:
                self.total_price = self.destination.base_price * days * self.travelers
            else:
                self.total_price = self.destination.base_price * self.travelers
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.destination.name} ({self.booking_reference})"

class UnifiedBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='unified_bookings')
    destination = models.ForeignKey('destinations.Destination', on_delete=models.CASCADE)
    hotel = models.ForeignKey('destinations.Hotel', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    travelers = models.IntegerField(default=1)
    
    # Comprehensive details as JSON
    transport_details = models.JSONField(default=dict, blank=True) # {type: 'flight', no: 'AI-101', price: 5000}
    add_ons = models.JSONField(default=list, blank=True) # [{name: 'Insurance', price: 500}, {name: 'Guided Tour', price: 1500}]
    travelers_info = models.JSONField(default=list, blank=True) # [{name: 'John Doe', age: 25}, {name: 'Jane Doe', age: 22}]
    
    # Payment and Status
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_reference = models.CharField(max_length=20, unique=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = 'BK' + uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.destination.name} - {self.booking_reference}"
