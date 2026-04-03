from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import HotelBooking, TripBooking, UnifiedBooking
from .serializers import HotelBookingSerializer, TripBookingSerializer, UnifiedBookingSerializer

class UnifiedBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = UnifiedBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UnifiedBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UnifiedBookingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = UnifiedBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UnifiedBooking.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'cancelled':
            return Response({'error': 'Booking is already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = 'cancelled'
        instance.save()
        return Response({'status': 'cancelled', 'message': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)

class HotelBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = HotelBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HotelBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HotelBookingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = HotelBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HotelBooking.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'cancelled':
            return Response({'error': 'Booking is already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = 'cancelled'
        instance.save()
        return Response({'status': 'cancelled', 'message': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)

class TripBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = TripBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TripBookingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = TripBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripBooking.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'cancelled':
            return Response({'error': 'Booking is already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = 'cancelled'
        instance.save()
        return Response({'status': 'cancelled', 'message': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)

# Removed redundant compatibility views
