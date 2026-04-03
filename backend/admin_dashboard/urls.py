from django.urls import path
from .views import AdminStatsView, AdminUserListView, AdminBookingListView, AdminAuditLogView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('bookings/', AdminBookingListView.as_view(), name='admin-bookings'),
    path('logs/', AdminAuditLogView.as_view(), name='admin-logs'),
]
