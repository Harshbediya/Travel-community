import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking, fetchTripBookings, fetchUnifiedBookings } from '../store/bookingsSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, SearchX, Clock, CreditCard, Ban, Users, Hotel, Plane, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast';
import { destinationImages, hotelImages } from '../assets';

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelBookings, tripBookings, unifiedBookings, isLoading } = useSelector((state) => state.bookings);
  const { token } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('ALL'); 

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserBookings());
    dispatch(fetchTripBookings());
    dispatch(fetchUnifiedBookings());
  }, [dispatch, token, navigate]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await dispatch(cancelBooking(id)).unwrap();
        Toast.success("Booking cancelled successfully.");
      } catch (err) {
        Toast.error("Failed to cancel booking.");
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
      confirmed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const allTrips = [
    ...tripBookings.map(b => ({ ...b, type: 'trip' })),
    ...hotelBookings.map(b => ({ ...b, type: 'hotel' })),
    ...unifiedBookings.map(b => ({ ...b, type: 'unified' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredBookings = allTrips.filter(b => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return b.status === 'pending' || b.status === 'confirmed';
    return b.status === filter.toLowerCase();
  });

  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-heading font-bold text-navy dark:text-white mb-3">My Trips</h1>
        <p className="text-gray-500 text-lg">Manage your upcoming adventures and view past bookings.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-navy-light p-2 rounded-xl border dark:border-gray-800 shadow-sm w-fit mx-auto md:mx-0">
        {['ALL', 'UPCOMING', 'CANCELLED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${filter === tab ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="animate-pulse h-48 bg-gray-200 dark:bg-navy-light rounded-card"></div>)}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => {
            const getBookingImage = () => {
              if (booking.type === 'trip' || booking.type === 'unified') {
                const name = booking.destination_details?.name;
                if (destinationImages[name]) {
                  return destinationImages[name][0];
                }
                return booking.destination_details?.featured_image || 'https://placehold.co/400';
              } else {
                // For hotels, use a stable index based on the hotel ID if possible
                const hotelIdx = booking.hotel_details?.id ? 
                  parseInt(booking.hotel_details.id.replace(/-/g, ''), 16) % hotelImages.length : 
                  index % hotelImages.length;
                return hotelImages[hotelIdx] || (booking.hotel_details?.featured_image || 'https://placehold.co/400?text=Hotel');
              }
            };

            return (
              <div key={`${booking.type}-${booking.id}`} className="bg-white dark:bg-navy-light rounded-card shadow-sm border hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 transition-colors p-6 flex flex-col md:flex-row gap-6">
                
                <div className="w-full md:w-48 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={getBookingImage()} 
                    alt={booking.type === 'hotel' ? booking.hotel_details?.name : booking.destination_details?.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold font-heading text-navy dark:text-white line-clamp-1 flex items-center gap-2">
                        {booking.type === 'hotel' && <Hotel className="w-5 h-5 text-secondary" />}
                        {booking.type === 'unified' && <ShieldCheck className="w-5 h-5 text-primary" />}
                        {booking.type === 'hotel' ? booking.hotel_details?.name : booking.destination_details?.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    {booking.type === 'unified' && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-navy rounded-full font-bold text-gray-500 uppercase flex items-center gap-1">
                          <Hotel className="w-3 h-3" /> {booking.hotel_details?.name}
                        </span>
                        {booking.transport_details && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-navy rounded-full font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Plane className="w-3 h-3" /> {booking.transport_details.company}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          {new Date(booking.check_in || booking.travel_date || booking.start_date).toLocaleDateString()} - {new Date(booking.check_out || booking.return_date || booking.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">{booking.guests || booking.travelers} Travelers</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">Ref: <span className="font-mono font-bold">{booking.booking_reference}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-navy dark:text-white">₹{booking.total_price}</span>
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t dark:border-gray-800">
                  {booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Ban className="w-4 h-4" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-navy-light rounded-card border-2 border-dashed dark:border-gray-800">
          <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold dark:text-white mb-2">No trips found</h3>
          <p className="text-gray-500 mb-8">You haven't made any bookings yet.</p>
          <Link to="/destinations" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors inline-block">
            Explore Destinations
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookings;
