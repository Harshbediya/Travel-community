import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  { id: 1, name: 'Alex Johnson', location: 'New York, USA', avatar: 'https://i.pravatar.cc/100?img=11', rating: 5, quote: "WanderTribe made it incredibly easy to find hidden gems in Japan. The community reviews are spot on!" },
  { id: 2, name: 'Sofia Garcia', location: 'Madrid, Spain', avatar: 'https://i.pravatar.cc/100?img=5', rating: 5, quote: "I've met so many amazing travelers through this platform. The luxury stays are carefully curated and absolutely stunning." },
  { id: 3, name: 'Liam Chen', location: 'Toronto, Canada', avatar: 'https://i.pravatar.cc/100?img=12', rating: 4, quote: "Booking was seamless, and the recommendations for local cafes transformed my Paris trip." },
  { id: 4, name: 'Emma Watson', location: 'London, UK', avatar: 'https://i.pravatar.cc/100?img=9', rating: 5, quote: "The community posts feature is fantastic. Sharing my journey and connecting with others is my favorite part." },
  { id: 5, name: 'David Smith', location: 'Sydney, Australia', avatar: 'https://i.pravatar.cc/100?img=13', rating: 5, quote: "An indispensable tool for any serious traveler. Highly recommend WanderTribe for authentic experiences." },
];

const TestimonialCarousel = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10 dark:text-white">Hear from Our Tribe</h2>
      
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="pb-12"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="bg-white dark:bg-navy-light p-8 rounded-card shadow-md h-full flex flex-col justify-between border dark:border-gray-800">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                <div>
                  <h4 className="font-bold text-navy dark:text-white">{t.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialCarousel;
