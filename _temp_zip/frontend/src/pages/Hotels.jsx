import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Star, Filter, X, Sparkles, ArrowRight, Hotel } from 'lucide-react';
import { fetchHotels } from '../store/hotelsSlice';
import { createHotelBooking, resetStatus } from '../store/bookingsSlice';
import Toast from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { hotelImages } from '../assets';

const Hotels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hotels, isLoading: hotelsLoading } = useSelector((state) => state.hotels);
  const { token } = useSelector((state) => state.auth);
  const { isLoading: bookingLoading, success: bookingSuccess } = useSelector((state) => state.bookings);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    star_rating: searchParams.get('star_rating') || '',
  });

  const [bookingHotel, setBookingHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    check_in: '',
    check_out: '',
    guests: 1
  });

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchHotels(params));
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (bookingSuccess) {
      Toast.success(`Successfully booked ${bookingHotel?.name}!`);
      setBookingHotel(null);
      dispatch(resetStatus());
      navigate('/bookings');
    }
  }, [bookingSuccess, dispatch, navigate, bookingHotel]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    setSearchParams(activeFilters);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const empty = { destination: '', min_price: '', max_price: '', star_rating: '' };
    setFilters(empty);
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const handleBookClick = (hotel) => {
    if (!token) {
      Toast.error("Please login to book a hotel");
      navigate('/login');
      return;
    }
    
    // Open hotel-only booking modal
    setBookingHotel(hotel);
    setBookingData({ 
      check_in: '', 
      check_out: '', 
      guests: 1 
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.check_in || !bookingData.check_out) {
      Toast.error("Please select check-in and check-out dates.");
      return;
    }

    try {
      await dispatch(createHotelBooking({
        hotel: bookingHotel.id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests
      })).unwrap();
    } catch (err) {
      Toast.error(err?.detail || "Failed to make booking.");
    }
  };

  // ... (rest of the component UI remains largely the same, just update field names)
  // I will assume the UI code is fine and just update the logic parts.
  // Actually, I should probably provide the full file to be safe.
  // But let's just update the key parts.
  
  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-28 bg-white dark:bg-navy-light p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black font-heading text-navy dark:text-white">Filters</h3>
              <div className="w-10 h-10 bg-gray-50 dark:bg-navy rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="font-black mb-4 dark:text-white text-xs uppercase tracking-[0.2em] text-gray-400">Price Range (₹)</h4>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      name="min_price" 
                      placeholder="Min" 
                      value={filters.min_price}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl dark:bg-navy dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <span className="text-gray-300 font-bold">-</span>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      name="max_price" 
                      placeholder="Max" 
                      value={filters.max_price}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl dark:bg-navy dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black mb-4 dark:text-white text-xs uppercase tracking-[0.2em] text-gray-400">Star Rating</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 4, 3, 2, 1].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilters(prev => ({...prev, star_rating: filters.star_rating == s ? '' : s}))}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border ${
                        filters.star_rating == s 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {s} <Star className={`w-3.5 h-3.5 ${filters.star_rating == s ? 'fill-white' : 'fill-gray-400 text-gray-400'}`} />
                    </button>
                  ))}
                  <button
                    onClick={() => setFilters(prev => ({...prev, star_rating: ''}))}
                    className={`flex items-center justify-center py-3 rounded-2xl font-bold text-sm transition-all border ${
                      filters.star_rating === '' 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={applyFilters} 
                  className="bg-navy hover:bg-primary text-white py-4 rounded-[20px] font-black shadow-xl shadow-navy/10 hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={clearFilters} 
                  className="text-gray-400 hover:text-primary dark:hover:text-white py-2 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Grid */}
        <div className="flex-1">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-widest text-[10px] mb-4">
                <Sparkles className="w-3 h-3" />
                Premium Stays
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading text-navy dark:text-white tracking-tight">Luxury Hotels</h1>
              <p className="text-gray-400 font-bold mt-2">Discover {hotels.length} curated premium stays for your journey</p>
            </div>
          </div>

          {hotelsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <LoadingSkeleton key={i} />)}
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
                <div key={hotel.id} className="group bg-white dark:bg-navy-light rounded-[40px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={hotelImages[index % hotelImages.length] || (hotel.featured_image ? hotel.featured_image : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80')} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-black text-navy">{hotel.star_rating}.0</span>
                    </div>
                    {hotel.is_available && (
                      <div className="absolute bottom-5 left-5 bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                        Available
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.15em] mb-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-3 h-3" />
                      </div>
                      {hotel.destination_name}
                    </div>
                    <h3 className="text-2xl font-black font-heading text-navy dark:text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors">{hotel.name}</h3>
                    <p className="text-gray-400 font-medium text-sm mb-6 line-clamp-2 leading-relaxed">{hotel.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hotel.amenities?.slice(0, 3).map(a => (
                        <span key={a} className="text-[10px] px-3 py-1.5 bg-gray-50 dark:bg-navy text-gray-500 dark:text-gray-400 rounded-xl font-black uppercase tracking-tighter border border-gray-100 dark:border-gray-800">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-50 dark:border-gray-800 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price per night</span>
                          <span className="text-2xl font-black text-navy dark:text-white">₹{hotel.price_per_night}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20">
                           <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Instant Book</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleBookClick(hotel)}
                        className="w-full bg-navy hover:bg-primary text-white py-4 rounded-2xl text-[15px] font-black shadow-xl shadow-navy/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Book Your Stay
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 dark:bg-navy-light rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="bg-white dark:bg-navy w-24 h-24 rounded-[32px] shadow-xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-navy dark:text-white mb-2 tracking-tight">No hotels found</h3>
              <p className="text-gray-400 font-bold">Try adjusting your filters to find your perfect stay</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingHotel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-navy-dark w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-center relative">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-widest text-[10px] mb-2">
                  <Hotel className="w-3 h-3" />
                  Quick Booking
                </div>
                <h3 className="text-3xl font-black font-heading text-navy dark:text-white tracking-tight">Reserve Your Room</h3>
              </div>
              <button 
                onClick={() => setBookingHotel(null)} 
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-navy text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-8 pt-4 space-y-8">
              {/* Hotel Preview Card */}
              <div className="flex gap-6 p-5 bg-gray-50 dark:bg-navy rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-inner group">
                <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-2xl">
                  <img 
                    src={bookingHotel.featured_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt=""
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-navy">{bookingHotel.star_rating}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-black text-navy dark:text-white text-lg mb-1 leading-tight">{bookingHotel.name}</h4>
                  <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {bookingHotel.destination_name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-primary">₹{bookingHotel.price_per_night}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/night</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Check In</label>
                  <div className="relative group">
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.check_in}
                      onChange={(e) => setBookingData({...bookingData, check_in: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none dark:bg-navy dark:text-white rounded-[20px] font-bold focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Check Out</label>
                  <div className="relative group">
                    <input 
                      type="date" 
                      required
                      min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                      value={bookingData.check_out}
                      onChange={(e) => setBookingData({...bookingData, check_out: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none dark:bg-navy dark:text-white rounded-[20px] font-bold focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Counter */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Number of Guests</label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-navy p-2 rounded-[22px] border border-gray-100 dark:border-gray-800 shadow-sm w-full sm:w-48">
                  <button 
                    type="button"
                    onClick={() => setBookingData(prev => ({...prev, guests: Math.max(1, prev.guests - 1)}))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-navy-light text-navy dark:text-white font-black hover:bg-primary hover:text-white transition-all shadow-sm text-lg"
                  >
                    -
                  </button>
                  <span className="font-black dark:text-white text-xl px-4">{bookingData.guests}</span>
                  <button 
                    type="button"
                    onClick={() => setBookingData(prev => ({...prev, guests: Math.min(10, prev.guests + 1)}))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-navy-light text-navy dark:text-white font-black hover:bg-primary hover:text-white transition-all shadow-sm text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary & Price */}
              {bookingData.check_in && bookingData.check_out && (
                <div className="p-6 bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-[32px] flex justify-between items-center animate-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Stay Amount</span>
                    <span className="text-sm font-bold text-navy dark:text-gray-300">
                      {Math.max(0, (new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))} Nights × {bookingData.guests} Guests
                    </span>
                  </div>
                  <span className="text-3xl font-black text-primary">
                    ₹{bookingHotel.price_per_night * Math.max(0, (new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full bg-navy hover:bg-primary text-white py-5 rounded-[22px] font-black text-lg shadow-2xl shadow-navy/20 hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 duration-300"
              >
                {bookingLoading ? (
                  <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
