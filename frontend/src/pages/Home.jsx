import React from 'react';
import { Plane, Calendar, MapPin, Send, Plus, Building, Globe, Mail, HeartHandshake } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

// Local Assets
import imgGreece from '../assets/Trip To Greece.jpg';
import imgUK from '../assets/UK.jpg';
import imgOngoing from '../assets/ongoing.avif';
import { destinationImages } from '../assets';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary/30">
      <HeroSection />

      {/* Category Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full text-center relative">
        <div className="absolute top-10 right-20 -z-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0V100M0 50H100M25 25L75 75M75 25L25 75" stroke="#DF6951" strokeOpacity="0.1" strokeWidth="2"/>
          </svg>
        </div>
        <p className="text-muted font-semibold uppercase tracking-[0.2em] mb-2 text-lg">Category</p>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-16 capitalize">We Offer Best Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { title: "Calculated Weather", desc: "Get real-time weather updates for your favorite destinations to plan better.", icon: <Globe className="w-10 h-10 text-primary" /> },
            { title: "Best Flights", desc: "Compare and book the cheapest flights across 500+ airlines worldwide.", icon: <Plane className="w-10 h-10 text-secondary" />, active: true },
            { title: "Local Events", desc: "Discover hidden gems and local festivals happening around you.", icon: <Calendar className="w-10 h-10 text-navy" /> },
            { title: "Customization", desc: "Tailor-made itineraries designed specifically for your travel style.", icon: <Building className="w-10 h-10 text-primary" /> },
          ].map((service, i) => (
            <div key={i} className={`relative p-10 rounded-[40px] bg-white transition-all duration-500 hover:-translate-y-2 group ${service.active ? 'shadow-[0_40px_80px_rgba(0,0,0,0.06)]' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]'}`}>
              {service.active && (
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/20 rounded-[30px] rounded-br-[10px] -z-10 group-hover:rotate-12 transition-transform"></div>
              )}
              <div className="flex justify-center mb-8 relative">
                <div className="w-24 h-24 bg-gray-50 dark:bg-navy-light rounded-[32px] flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                  {service.icon}
                </div>
              </div>
              <h3 className="font-bold text-navy text-2xl mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed px-2">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Selling Destinations */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full text-center">
        <p className="text-secondary font-bold uppercase tracking-[0.2em] mb-4 text-sm md:text-base">Top Selling</p>
        <h2 className="text-4xl md:text-6xl font-heading font-black text-navy mb-16 capitalize tracking-tight">Top Destinations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { img: destinationImages['Goa']?.[0], city: "Goa", country: "India", price: "₹45,000", days: "7 Days Trip" },
            { img: destinationImages['Jaipur']?.[0], city: "Jaipur", country: "India", price: "₹35,000", days: "5 Days Trip" },
            { img: destinationImages['Shimla']?.[0], city: "Shimla", country: "India", price: "₹38,000", days: "6 Days Trip" },
          ].map((dest, i) => (
            <div key={i} className="group relative rounded-[40px] bg-white transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-[420px] overflow-hidden relative">
                <img src={dest.img} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-primary shadow-lg">
                  {dest.price}
                </div>
              </div>
              <div className="p-8 text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-navy group-hover:text-primary transition-colors">{dest.city}, {dest.country}</h3>
                </div>
                <div className="flex items-center gap-3 text-gray-500 font-bold">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <span>{dest.days}</span>
                </div>
              </div>
              {/* Hover Overlay Decor */}
              <div className="absolute inset-0 border-[3px] border-primary/0 group-hover:border-primary/20 rounded-[40px] transition-all duration-700 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Book Your Next Trip Steps */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <p className="text-secondary font-bold uppercase tracking-[0.2em] mb-4 text-sm md:text-base">Easy and Fast</p>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-navy mb-12 capitalize leading-[1.1] tracking-tight">Book your next trip <br/>in 3 easy steps</h2>
            
            <div className="space-y-10 relative">
              {/* Vertical line decor */}
              <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gray-100 -z-10 hidden md:block"></div>
              
              {[
                { icon: <MapPin className="text-white w-6 h-6" />, color: "bg-primary", title: "Choose Destination", desc: "Select from our curated list of 500+ exotic locations worldwide." },
                { icon: <Building className="text-white w-6 h-6" />, color: "bg-secondary", title: "Make Payment", desc: "Secure and fast payment options with 256-bit encryption." },
                { icon: <Plane className="text-white w-6 h-6" />, color: "bg-navy", title: "Start Your Adventure", desc: "Get your tickets and start exploring the world with us." }
              ].map((step, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {step.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-black text-navy text-xl mb-2 group-hover:text-primary transition-colors">{step.title}</h4>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            {/* Background Blob */}
            <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 opacity-50 -top-20 -right-20"></div>
            
            <div className="bg-white p-8 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] w-full max-w-[420px] relative border border-gray-50 group hover:-translate-y-3 transition-transform duration-700">
              <div className="overflow-hidden rounded-[30px] mb-8">
                <img src={imgGreece} alt="Trip" className="w-full h-[220px] object-cover group-hover:scale-110 transition-transform duration-[2s]" />
              </div>
              <h3 className="font-black text-2xl tracking-tight text-navy mb-3">Trip To Greece</h3>
              <p className="text-gray-400 font-bold mb-8 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 14-29 June | <span className="text-navy/70">by Robin Joseph</span>
              </p>
              
              <div className="flex gap-4 mb-10">
                {[MapPin, Calendar, Send].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                    ))}
                  </div>
                  <span className="text-gray-500 font-bold text-sm">24+ going</span>
                </div>
                <button className="text-secondary hover:scale-110 transition-transform"><HeartHandshake className="w-8 h-8 fill-current" /></button>
              </div>

              {/* Ongoing Float Card - Enhanced */}
              <div className="absolute -left-24 bottom-24 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[280px] flex gap-5 border border-white/50 hidden xl:flex animate-bounce-slow">
                <div className="relative">
                  <img src={imgOngoing} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="user" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Ongoing</p>
                  <h4 className="font-black text-navy mb-2 text-lg">Trip to Rome</h4>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-navy text-sm"><span className="text-primary">40%</span> completed</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative">
        <div className="bg-[#DFD7F9]/20 w-full rounded-tl-[120px] rounded-[20px] relative overflow-hidden flex flex-col items-center justify-center p-12 md:p-24 text-center border border-[#DFD7F9]/30">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
          
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-tr from-secondary to-primary rounded-3xl flex items-center justify-center shadow-2xl rotate-12 z-20 group hover:rotate-0 transition-transform duration-500">
             <Send className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 mb-8 shadow-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Newsletter</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-navy mb-8 leading-[1.2]">
              Subscribe to get information, latest news and other <span className="text-primary italic">interesting offers</span> about Travelworld
            </h2>
            
            <p className="text-gray-500 font-medium mb-12 max-w-xl mx-auto text-lg leading-relaxed">
              Join our community of 50,000+ travelers and get exclusive deals delivered straight to your inbox.
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto bg-white p-3 rounded-[24px] shadow-2xl shadow-primary/10 border border-gray-100">
              <div className="relative flex-1 flex items-center group">
                <span className="absolute left-6 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail className="w-6 h-6" />
                </span>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full py-5 pl-16 pr-6 rounded-2xl text-navy font-semibold focus:outline-none placeholder-gray-400 text-lg"
                  required
                />
              </div>
              <button className="bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold rounded-[18px] px-12 py-5 shadow-xl shadow-primary/20 text-lg">
                Subscribe Now
              </button>
            </form>
            
            <p className="mt-8 text-sm text-gray-400 font-medium">
              We care about your data. Read our <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
