import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Calendar, Hotel, Plane, 
  CreditCard, CheckCircle, Info, MapPin, Users, Plus, Trash2, Tag, ShieldCheck
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from '../api/axiosInstance';
import { updatePartialBooking, clearPartialBooking, createUnifiedBooking } from '../store/bookingsSlice';
import Toast from '../components/Toast';

// Mock Transportation Data
const TRANSPORT_OPTIONS = [
  { id: 't1', type: 'Flight', company: 'Air India', price: 4500, time: '14:30 - 16:45', class: 'Economy' },
  { id: 't2', type: 'Flight', company: 'IndiGo', price: 3800, time: '08:15 - 10:30', class: 'Economy' },
  { id: 't3', type: 'Train', company: 'Rajdhani Exp', price: 2200, time: '20:00 - 06:00', class: '3AC' },
  { id: 't4', type: 'Bus', company: 'Volvo Luxury', price: 1200, time: '22:00 - 08:00', class: 'Sleeper' },
];

// Mock Add-ons
const ADD_ONS = [
  { id: 'a1', name: 'Travel Insurance', price: 499, description: 'Medical cover & trip cancellation' },
  { id: 'a2', name: 'Airport Transfer', price: 800, description: 'Private taxi to your hotel' },
  { id: 'a3', name: 'Guided City Tour', price: 1500, description: 'Full day sightseeing with expert' },
];

const BookingWizard = () => {
  const { id: destinationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentBooking, isLoading } = useSelector(state => state.bookings);
  
  const [step, setStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card State for Validation
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  
  // Wizard State
  const [wizardData, setWizardData] = useState({
    startDate: location.state?.startDate ? new Date(location.state.startDate) : (currentBooking.startDate ? new Date(currentBooking.startDate) : new Date()),
    endDate: location.state?.endDate ? new Date(location.state.endDate) : (currentBooking.endDate ? new Date(currentBooking.endDate) : new Date(Date.now() + 86400000 * 3)),
    travelers: location.state?.guests || currentBooking.travelers || 1,
    hotel: location.state?.hotel || currentBooking.hotel || null,
    transport: currentBooking.transport || null,
    addOns: currentBooking.addOns || [],
    travelersInfo: currentBooking.travelersInfo && currentBooking.travelersInfo.length > 0 
      ? currentBooking.travelersInfo 
      : Array.from({ length: (location.state?.guests || currentBooking.travelers || 1) }, () => ({ name: '', age: '' })),
  });

  useEffect(() => {
    if (location.state?.fromHotels) {
      setStep(0); // Ensure we start from step 0 (Dates) but with hotel pre-selected
    }
  }, [location.state]);

  const steps = [
    { title: 'Dates & Travelers', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Accommodations', icon: <Hotel className="w-5 h-5" /> },
    { title: 'Transportation', icon: <Plane className="w-5 h-5" /> },
    { title: 'Review & Add-ons', icon: <Info className="w-5 h-5" /> },
    { title: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, hotelsRes] = await Promise.all([
          axiosInstance.get(`/api/destinations/${destinationId}/`),
          axiosInstance.get(`/api/hotels/?destination=${destinationId}`)
        ]);
        setDestination(destRes.data);
        setHotels(hotelsRes.data.results || hotelsRes.data);
      } catch (err) {
        Toast.error("Failed to load destination data");
      }
    };
    fetchData();
  }, [destinationId]);

  // Auto-save logic
  useEffect(() => {
    dispatch(updatePartialBooking(wizardData));
  }, [wizardData, dispatch]);

  const nextStep = () => {
    if (step === 0 && (!wizardData.startDate || !wizardData.endDate)) return Toast.error("Please select dates");
    if (step === 1 && !wizardData.hotel) return Toast.error("Please select a hotel");
    if (step === 2 && !wizardData.transport) return Toast.error("Please select transportation");
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const calculateTotal = () => {
    let total = 0;
    if (destination) total += (Number(destination.base_price) || 0) * wizardData.travelers;
    if (wizardData.hotel) total += (Number(wizardData.hotel.price_per_night) || 0) * wizardData.travelers * 3; // Mock 3 nights
    if (wizardData.transport) total += (Number(wizardData.transport.price) || 0) * wizardData.travelers;
    wizardData.addOns.forEach(a => total += (Number(a.price) || 0));
    return total;
  };

  const handleFinalBooking = async () => {
    if (paymentMethod === 'Credit Card') {
      if (!cardData.number || cardData.number.length < 19) return Toast.error("Please enter a valid card number");
      if (!cardData.expiry || cardData.expiry.length < 5) return Toast.error("Please enter expiry date");
      if (!cardData.cvv || cardData.cvv.length < 3) return Toast.error("Please enter CVV");
      if (!cardData.name) return Toast.error("Please enter cardholder name");
    }

    setIsSubmitting(true);
    try {
      const totalPriceValue = calculateTotal();
      const finalPrice = Math.round(totalPriceValue * 1.12);
      
      // Ensure we have all required fields and they are in correct format
      const payload = {
        destination: destination.id,
        hotel: wizardData.hotel?.id || null,
        start_date: wizardData.startDate ? wizardData.startDate.toISOString().split('T')[0] : null,
        end_date: wizardData.endDate ? wizardData.endDate.toISOString().split('T')[0] : null,
        travelers: parseInt(wizardData.travelers) || 1,
        transport_details: wizardData.transport || {},
        add_ons: wizardData.addOns || [],
        travelers_info: wizardData.travelersInfo || [],
        total_price: isNaN(finalPrice) ? 0 : finalPrice,
        payment_method: paymentMethod || 'Credit Card'
      };

      console.log("Sending Booking Payload:", payload);
      
      const response = await dispatch(createUnifiedBooking(payload)).unwrap();
      dispatch(clearPartialBooking());
      setConfirmedBooking(response);
      setIsConfirmed(true);
      Toast.success("Booking confirmed!");
    } catch (err) {
      console.error("Full Booking Error Object:", err);
      
      const errorData = err.response?.data || err.payload || err;
      
      if (errorData && typeof errorData === 'object') {
        const firstError = Object.values(errorData)[0];
        const msg = Array.isArray(firstError) ? firstError[0] : (errorData.detail || errorData.message || "Failed to complete booking");
        Toast.error(msg);
      } else {
        Toast.error(err.message || "Failed to complete booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!destination) return <div className="pt-32 text-center">Loading...</div>;

  if (isConfirmed && confirmedBooking) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-navy-light rounded-3xl shadow-xl overflow-hidden border dark:border-gray-800"
        >
          <div className="bg-green-500 p-10 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-2">Booking Done!</h1>
            <p className="text-xl opacity-90">Your trip to {destination.name} is confirmed.</p>
            <div className="mt-6 inline-block bg-white/20 px-6 py-2 rounded-full font-mono font-bold text-lg">
              Ref: {confirmedBooking.booking_reference}
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-bold">{destination.name}, {destination.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {new Date(confirmedBooking.start_date).toLocaleDateString()} - {new Date(confirmedBooking.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">{confirmedBooking.travelers} Travelers</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Hotel className="w-5 h-5 text-primary" />
                    <span className="font-medium">{confirmedBooking.hotel_details?.name}</span>
                  </div>
                  {confirmedBooking.transport_details && (
                    <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {confirmedBooking.transport_details.company} ({confirmedBooking.transport_details.type})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Paid via {confirmedBooking.payment_method}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-navy p-6 rounded-2xl border dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Traveler Information</h3>
              <div className="space-y-2">
                {confirmedBooking.travelers_info?.map((t, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-bold">{t.name || `Traveler ${i+1}`}</span>
                    <span className="text-gray-500">Age: {t.age || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => navigate('/bookings')}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all text-center"
              >
                Go to My Bookings
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 border-2 border-gray-200 hover:border-primary hover:text-primary font-bold py-4 rounded-xl transition-all text-center"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto min-h-screen">
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                i <= step ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {i < step ? <CheckCircle className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-tighter hidden sm:block ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-navy-light rounded-3xl p-8 border dark:border-gray-800 shadow-sm min-h-[500px]"
            >
              {/* STEP 0: DATES */}
              {step === 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold font-heading dark:text-white">When are you traveling?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Check-in</label>
                      <DatePicker
                        selected={wizardData.startDate}
                        onChange={date => setWizardData({...wizardData, startDate: date})}
                        className="w-full p-4 bg-gray-50 dark:bg-navy border rounded-xl dark:text-white"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Check-out</label>
                      <DatePicker
                        selected={wizardData.endDate}
                        onChange={date => setWizardData({...wizardData, endDate: date})}
                        className="w-full p-4 bg-gray-50 dark:bg-navy border rounded-xl dark:text-white"
                        minDate={wizardData.startDate}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Travelers</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => {
                        const newCount = Math.max(1, wizardData.travelers - 1);
                        setWizardData({
                          ...wizardData, 
                          travelers: newCount,
                          travelersInfo: wizardData.travelersInfo.slice(0, newCount)
                        });
                      }} className="w-12 h-12 rounded-xl border flex items-center justify-center">-</button>
                      <span className="text-2xl font-bold w-12 text-center">{wizardData.travelers}</span>
                      <button onClick={() => {
                        const newCount = wizardData.travelers + 1;
                        setWizardData({
                          ...wizardData, 
                          travelers: newCount,
                          travelersInfo: [...wizardData.travelersInfo, { name: '', age: '' }]
                        });
                      }} className="w-12 h-12 rounded-xl border flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: HOTELS */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading dark:text-white">Choose your stay</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {hotels.map(h => (
                      <div 
                        key={h.id} 
                        onClick={() => setWizardData({...wizardData, hotel: h})}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                          wizardData.hotel?.id === h.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <img src={h.featured_image || 'https://placehold.co/100'} className="w-24 h-24 rounded-xl object-cover" alt="" />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{h.name}</h3>
                            <p className="text-sm text-gray-500">{h.address}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="font-bold text-primary">₹{h.price_per_night}/night</span>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <span className="font-bold text-xs">{h.star_rating} ★</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: TRANSPORT */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading dark:text-white">How will you get there?</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {TRANSPORT_OPTIONS.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => setWizardData({...wizardData, transport: t})}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                          wizardData.transport?.id === t.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-full">
                              {t.type === 'Flight' ? <Plane className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className="font-bold">{t.company}</h3>
                              <p className="text-sm text-gray-500">{t.type} • {t.class} • {t.time}</p>
                            </div>
                          </div>
                          <span className="font-bold text-xl">₹{t.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & ADD-ONS */}
              {step === 3 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold font-heading dark:text-white">Review & Extras</h2>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Recommended for your trip</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ADD_ONS.map(a => {
                        const isSelected = wizardData.addOns.find(x => x.id === a.id);
                        return (
                          <div 
                            key={a.id} 
                            onClick={() => {
                              if (isSelected) setWizardData({...wizardData, addOns: wizardData.addOns.filter(x => x.id !== a.id)});
                              else setWizardData({...wizardData, addOns: [...wizardData.addOns, a]});
                            }}
                            className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                              isSelected ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="font-bold text-sm">{a.name}</span>
                              {isSelected && <CheckCircle className="w-4 h-4 text-primary" />}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{a.description}</p>
                            <span className="font-bold text-sm text-primary">₹{a.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Traveler Details</h3>
                    <div className="space-y-4">
                      {[...Array(wizardData.travelers)].map((_, i) => (
                        <div key={i} className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder={`Traveler ${i+1} Name`}
                            className="p-3 border rounded-xl dark:bg-navy dark:text-white"
                            value={wizardData.travelersInfo[i]?.name || ''}
                            onChange={(e) => {
                              const newInfo = [...wizardData.travelersInfo];
                              newInfo[i] = { ...newInfo[i], name: e.target.value };
                              setWizardData({...wizardData, travelersInfo: newInfo});
                            }}
                          />
                          <input 
                            placeholder="Age"
                            type="number"
                            className="p-3 border rounded-xl dark:bg-navy dark:text-white"
                            value={wizardData.travelersInfo[i]?.age || ''}
                            onChange={(e) => {
                              const newInfo = [...wizardData.travelersInfo];
                              newInfo[i] = { ...newInfo[i], age: e.target.value };
                              setWizardData({...wizardData, travelersInfo: newInfo});
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT */}
              {step === 4 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold font-heading dark:text-white">Secure Payment</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Credit Card', 'GPay', 'PayPal'].map(method => (
                      <button 
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === method ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                        }`}
                      >
                        {method === 'Credit Card' && <CreditCard className="w-6 h-6" />}
                        {method === 'GPay' && <Tag className="w-6 h-6 text-blue-500" />}
                        {method === 'PayPal' && <Tag className="w-6 h-6 text-indigo-600" />}
                        <span className="font-bold text-sm">{method}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'Credit Card' ? (
                    <div className="p-8 border-2 border-primary/20 bg-primary/5 rounded-3xl relative overflow-hidden">
                      {/* Card Type Decoration */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                      
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <CreditCard className="w-6 h-6" />
                          <span className="text-lg">Card Details (PCI-Compliant Mock)</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-10 h-6 bg-white/50 rounded-md border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">VISA</div>
                          <div className="w-10 h-6 bg-white/50 rounded-md border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">MC</div>
                        </div>
                      </div>

                      <div className="space-y-5 relative z-10">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Card Number</label>
                          <input 
                            placeholder="0000 0000 0000 0000" 
                            className="w-full p-4 bg-white dark:bg-navy border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono tracking-widest"
                            value={cardData.number}
                            maxLength={19}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                              const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                              setCardData({...cardData, number: formatted});
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Expiry Date</label>
                            <input 
                              placeholder="MM/YY" 
                              className="w-full p-4 bg-white dark:bg-navy border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
                              value={cardData.expiry}
                              maxLength={5}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                setCardData({...cardData, expiry: val});
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CVV</label>
                            <input 
                              placeholder="***" 
                              type="password"
                              className="w-full p-4 bg-white dark:bg-navy border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
                              value={cardData.cvv}
                              maxLength={3}
                              onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cardholder Name</label>
                          <input 
                            placeholder="NAME ON CARD" 
                            className="w-full p-4 bg-white dark:bg-navy border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all uppercase font-medium"
                            value={cardData.name}
                            onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        <span>Your payment information is encrypted and securely tokenized.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                        paymentMethod === 'GPay' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        <Tag className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Pay with {paymentMethod}</h3>
                      <p className="text-gray-500">You will be redirected to {paymentMethod} to complete your payment securely.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button 
              onClick={prevStep} 
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            
            {step < steps.length - 1 ? (
              <button 
                onClick={nextStep}
                className="bg-primary hover:bg-primary-dark text-white px-10 py-3 rounded-pill font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleFinalBooking}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-3 rounded-pill font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Complete Booking <CheckCircle className="w-5 h-5" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white dark:bg-navy-light rounded-3xl p-6 border dark:border-gray-800 shadow-sm sticky top-28">
            <h3 className="text-xl font-bold font-heading mb-6 dark:text-white">Trip Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Destination</p>
                  <p className="font-bold text-navy dark:text-white">{destination.name}, {destination.country}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Travelers</p>
                  <p className="font-bold text-navy dark:text-white">{wizardData.travelers} Persons</p>
                </div>
              </div>

              {wizardData.hotel && (
                <div className="flex gap-3">
                  <Hotel className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Hotel</p>
                    <p className="font-bold text-navy dark:text-white line-clamp-1">{wizardData.hotel.name}</p>
                  </div>
                </div>
              )}

              {wizardData.transport && (
                <div className="flex gap-3">
                  <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Transport</p>
                    <p className="font-bold text-navy dark:text-white">{wizardData.transport.company} ({wizardData.transport.type})</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t dark:border-gray-800 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base Price ({wizardData.travelers}x)</span>
                <span className="font-bold">₹{(Number(destination.base_price) || 0) * wizardData.travelers}</span>
              </div>
              {wizardData.hotel && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Accommodation</span>
                  <span className="font-bold">₹{(Number(wizardData.hotel.price_per_night) || 0) * wizardData.travelers * 3}</span>
                </div>
              )}
              {wizardData.transport && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transportation</span>
                  <span className="font-bold">₹{(Number(wizardData.transport.price) || 0) * wizardData.travelers}</span>
                </div>
              )}
              {wizardData.addOns.map(a => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{a.name}</span>
                  <span className="font-bold">₹{Number(a.price) || 0}</span>
                </div>
              ))}
              
              <div className="flex justify-between text-sm pt-2 text-primary font-bold">
                <span>Taxes & Fees</span>
                <span>₹{Math.round(calculateTotal() * 0.12)}</span>
              </div>

              <div className="border-t dark:border-gray-800 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{Math.round(calculateTotal() * 1.12)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
