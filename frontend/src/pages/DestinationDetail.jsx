import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationBySlug, toggleSave } from '../store/destinationsSlice';
import { createTripBooking } from '../store/bookingsSlice';
import { Heart, Star, MapPin, Check, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import Toast from '../components/Toast';
import "react-datepicker/dist/react-datepicker.css";
import { destinationImages } from '../assets';

const DestinationDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading } = useSelector((state) => state.destinations);
  const { token } = useSelector((state) => state.auth);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    dispatch(fetchDestinationBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (checkIn && checkOut && current) {
      const nights = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const basePrice = current.base_price || 5000;
      setTotalPrice(Math.round(nights * basePrice * guests));
    }
  }, [checkIn, checkOut, current, guests]);

  const handleBooking = () => {
    if (!token) return navigate('/login');
    if (!checkIn || !checkOut) return Toast.error("Please select travel dates.");
    
    // Pass partial booking to wizard
    navigate(`/book/${current.id}`, { 
      state: { 
        startDate: checkIn.toISOString(), 
        endDate: checkOut.toISOString(), 
        guests 
      } 
    });
  };

  const handleSaveToggle = () => {
    if (!token) return Toast.info("Please login to save destinations");
    dispatch(toggleSave(slug));
  };

  if (isLoading || !current) return <div className="pt-32 px-4 max-w-7xl mx-auto"><div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" /></div>;

  const getGalleryImage = (index) => {
    if (destinationImages[current.name] && destinationImages[current.name][index]) {
      return destinationImages[current.name][index];
    }
    return current.images?.[index]?.image 
      ? `https://res.cloudinary.com/dvz3i2jri/${current.images[index].image}` 
      : 'https://placehold.co/800x600';
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/destinations" className="hover:text-primary">Destinations</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-300">{current.name}</span>
      </div>

      {/* Gallery */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 overflow-hidden rounded-2xl h-[50vh] min-h-[400px]">
        <div className="w-full md:w-[60%] h-full">
          <img 
            src={getGalleryImage(0)} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            alt={current.name}
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 w-[40%] h-full">
          <img 
            src={getGalleryImage(1)} 
            className="w-full h-1/2 object-cover" 
            alt={`${current.name} 2`}
          />
          <div className="relative w-full h-1/2 cursor-pointer group">
            <img 
              src={getGalleryImage(2)} 
              className="w-full h-full object-cover" 
              alt={`${current.name} 3`}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <span className="text-white font-bold text-lg">Show all photos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-[65%]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-block bg-primary/10 text-primary uppercase text-xs font-bold px-3 py-1 rounded-pill mb-3">
                {current.category}
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy dark:text-white mb-2">{current.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" /> {current.city}, {current.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-800 mb-8">
            <div className="flex items-center gap-1 font-bold text-lg dark:text-white">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{current.avg_rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-600 dark:text-gray-400 underline">{current.total_reviews} reviews</span>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold font-heading mb-4 dark:text-white">About this place</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {current.description}
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold font-heading mb-4 dark:text-white">What this place offers</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {current.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg">
                  <Check className="w-5 h-5 text-primary" /> {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold font-heading mb-4 dark:text-white">Where you'll be</h2>
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden border dark:border-gray-700">
              <iframe 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                loading="lazy" 
                allowFullScreen 
                src={`https://maps.google.com/maps?q=${current.latitude || 0},${current.longitude || 0}&hl=es;z=14&output=embed`}
              ></iframe>
            </div>
          </div>

          {/* Reviews Section Placeholder */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2 dark:text-white">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              {current.avg_rating.toFixed(1)} · {current.total_reviews} reviews
            </h2>
            <button className="px-6 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors">
              Show all reviews
            </button>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="w-full lg:w-[35%] relative">
          <div className="bg-white dark:bg-navy-light rounded-3xl p-6 border dark:border-gray-800 shadow-sm sticky top-28">
            <h3 className="text-xl font-bold font-heading mb-6 dark:text-white">Plan Your Trip</h3>
            
            {!token && (
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link> to book this destination and unlock exclusive features.
                </p>
              </div>
            )}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-3xl font-bold text-navy dark:text-white">₹{Number(current?.base_price || 5000).toLocaleString()}</span>
                <span className="text-gray-500 text-lg"> / person</span>
              </div>
            </div>

            <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden mb-6">
              <div className="flex border-b border-gray-300 dark:border-gray-600 divide-x divide-gray-300 dark:divide-gray-600">
                <div className="p-3 w-1/2">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Check-in</label>
                  <DatePicker 
                    selected={checkIn} 
                    onChange={setCheckIn} 
                    selectsStart 
                    startDate={checkIn} 
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Add date"
                    className="w-full bg-transparent focus:outline-none dark:text-white"
                  />
                </div>
                <div className="p-3 w-1/2">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Check-out</label>
                  <DatePicker 
                    selected={checkOut} 
                    onChange={setCheckOut} 
                    selectsEnd 
                    startDate={checkIn} 
                    endDate={checkOut} 
                    minDate={checkIn}
                    placeholderText="Add date"
                    className="w-full bg-transparent focus:outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="p-3">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Guests</label>
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setGuests(Math.max(1, guests-1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold dark:text-white dark:border-gray-500 hover:border-gray-800">-</button>
                  <span className="font-medium dark:text-white">{guests} guest{guests > 1 ? 's' : ''}</span>
                  <button type="button" onClick={() => setGuests(Math.min(20, guests+1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold dark:text-white dark:border-gray-500 hover:border-gray-800">+</button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl text-lg transition-colors mb-4"
            >
              Book Now
            </button>

            <button 
              onClick={handleSaveToggle}
              className="w-full flex items-center justify-center gap-2 border border-black dark:border-white text-navy dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
               <Heart className={`w-5 h-5 ${current.is_saved ? 'fill-red-500 text-red-500 border-none' : ''}`} /> 
               {current.is_saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {totalPrice > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between font-bold text-lg dark:text-white">
                  <span>Total price</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}
            
            {!token && (
              <p className="text-center text-sm text-gray-500 mt-4">You must be logged in to book.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
