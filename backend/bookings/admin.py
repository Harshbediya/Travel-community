from django.contrib import admin
from .models import HotelBooking, TripBooking

@admin.register(HotelBooking)
class HotelBookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'hotel', 'check_in', 'check_out', 'status', 'total_price')
    list_filter = ('status', 'check_in', 'hotel')
    search_fields = ('booking_reference', 'user__email', 'hotel__name')
    readonly_fields = ('booking_reference', 'total_price', 'created_at')

@admin.register(TripBooking)
class TripBookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'destination', 'travel_date', 'return_date', 'status', 'total_price')
    list_filter = ('status', 'travel_date', 'destination')
    search_fields = ('booking_reference', 'user__email', 'destination__name')
    readonly_fields = ('booking_reference', 'total_price', 'created_at')
