from django.contrib import admin
from .models import Destination, DestinationImage, Hotel

class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'category', 'avg_rating', 'is_featured')
    list_filter = ('category', 'is_featured', 'country')
    search_fields = ('name', 'city', 'country')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [DestinationImageInline]

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'destination', 'price_per_night', 'star_rating', 'is_available')
    list_filter = ('star_rating', 'is_available', 'destination')
    search_fields = ('name', 'destination__name', 'destination__city')
