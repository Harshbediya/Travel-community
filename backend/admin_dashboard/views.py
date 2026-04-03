from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from users.models import User
from bookings.models import UnifiedBooking
from community.models import Post
from destinations.models import Destination
from django.utils import timezone
from datetime import timedelta
from .models import AuditLog, SystemMetric
import random

class AdminStatsView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        last_30_days = now - timedelta(days=30)

        # Generate some mock system metrics if none exist (for demonstration)
        if not SystemMetric.objects.exists():
            SystemMetric.objects.create(name='CPU Usage', value=random.uniform(10, 30), unit='%')
            SystemMetric.objects.create(name='Memory Usage', value=random.uniform(40, 60), unit='%')
            SystemMetric.objects.create(name='Disk Usage', value=random.uniform(20, 40), unit='%')

        metrics = SystemMetric.objects.all()[:5]
        metrics_data = [{'name': m.name, 'value': m.value, 'unit': m.unit} for m in metrics]

        stats = {
            'total_users': User.objects.count(),
            'total_bookings': UnifiedBooking.objects.count(),
            'total_revenue': UnifiedBooking.objects.aggregate(total=Sum('total_price'))['total'] or 0,
            'total_posts': Post.objects.count(),
            'total_destinations': Destination.objects.count(),
            
            'new_users_30d': User.objects.filter(date_joined__gte=last_30_days).count(),
            'new_bookings_30d': UnifiedBooking.objects.filter(created_at__gte=last_30_days).count(),
            
            'recent_bookings': UnifiedBooking.objects.select_related('user', 'destination').order_by('-created_at')[:5],
            'recent_users': User.objects.order_by('-date_joined')[:5],
            'recent_logs': AuditLog.objects.select_related('user').order_by('-timestamp')[:10],
        }

        # Format data for response
        recent_bookings_data = [{
            'id': b.id,
            'user': b.user.username,
            'destination': b.destination.name if b.destination else 'N/A',
            'total_price': b.total_price,
            'status': b.status,
            'created_at': b.created_at
        } for b in stats['recent_bookings']]

        recent_users_data = [{
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'date_joined': u.date_joined,
            'is_staff': u.is_staff
        } for u in stats['recent_users']]

        recent_logs_data = [{
            'id': log.id,
            'user': log.user.username if log.user else 'System',
            'action': log.action,
            'description': log.description,
            'timestamp': log.timestamp,
            'ip_address': log.ip_address
        } for log in stats['recent_logs']]

        return Response({
            'metrics': {
                'total_users': stats['total_users'],
                'total_bookings': stats['total_bookings'],
                'total_revenue': stats['total_revenue'],
                'total_posts': stats['total_posts'],
                'total_destinations': stats['total_destinations'],
                'new_users_30d': stats['new_users_30d'],
                'new_bookings_30d': stats['new_bookings_30d'],
            },
            'system_health': metrics_data,
            'recent_bookings': recent_bookings_data,
            'recent_users': recent_users_data,
            'audit_logs': recent_logs_data
        })

class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    
    def get(self, request):
        users = self.get_queryset()
        data = [{
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'is_staff': u.is_staff,
            'is_active': u.is_active,
            'date_joined': u.date_joined
        } for u in users]
        return Response(data)

class AdminBookingListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = UnifiedBooking.objects.all().order_by('-created_at')

    def get(self, request):
        bookings = self.get_queryset()
        data = [{
            'id': b.id,
            'user': b.user.username,
            'destination': b.destination.name if b.destination else 'N/A',
            'total_price': b.total_price,
            'status': b.status,
            'created_at': b.created_at,
            'reference': getattr(b, 'booking_reference', f"REF-{b.id}")
        } for b in bookings]
        return Response(data)

class AdminAuditLogView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = AuditLog.objects.all().order_by('-timestamp')

    def get(self, request):
        logs = self.get_queryset()[:50]
        data = [{
            'id': log.id,
            'user': log.user.username if log.user else 'System',
            'action': log.action,
            'description': log.description,
            'timestamp': log.timestamp,
            'ip_address': log.ip_address
        } for log in logs]
        return Response(data)
