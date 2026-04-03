import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-24 pb-12 lg:pt-40 lg:pb-24 overflow-hidden bg-white dark:bg-navy min-h-[90vh] flex items-center">
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 -z-10 w-full max-w-4xl h-full hidden lg:block pointer-events-none">
        <div className="absolute top-10 right-[-5%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[90px]"></div>
        
        <svg viewBox="0 0 766 874" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 w-[680px] h-full opacity-35">
          <path d="M766 0C766 0 668.5 73.5 544 199.5C419.5 325.5 450.5 496 357.5 613.5C264.5 731 0 874 0 874L766 874V0Z" fill="#FFF1DA"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl z-10 text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-6 border border-primary/10 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-3 h-3" />
              Best Destinations around the world
            </motion.div>
            
            <motion.h1 
              className="font-heading text-navy dark:text-white text-3xl md:text-5xl lg:text-[62px] font-black mb-6 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Travel, <span className="relative inline-block text-primary">
                enjoy
                <motion.svg 
                  className="absolute w-full h-3 -bottom-1 left-0 text-secondary/40 -z-10" 
                  viewBox="0 0 254 12" 
                  fill="none" 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  xmlns="http://www.w3.org/2000/svg" 
                  preserveAspectRatio="none"
                >
                  <path d="M2.5 9.5C65.5 -1.5 168.5 -1.5 251.5 9.5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                </motion.svg>
              </span>
              <br/>and live a new <br/><span className="text-navy/80 dark:text-white/80 italic font-serif">full life.</span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8 font-medium leading-relaxed max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the world like never before. We curate the most unique and unforgettable travel experiences just for you.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="group bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                Find out more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-all border border-gray-100 group-hover:border-secondary">
                  <Play className="w-4 h-4 ml-1 text-secondary fill-current" />
                </div>
                <span className="font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors text-sm tracking-wide">Play Demo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap justify-center lg:justify-start gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div>
                <p className="text-xl font-black text-navy dark:text-white">15k+</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Travelers</p>
              </div>
              <div>
                <p className="text-xl font-black text-navy dark:text-white">500+</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Places</p>
              </div>
              <div>
                <p className="text-xl font-black text-navy dark:text-white">4.9/5</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Right Image Container */}
          <motion.div 
            className="relative z-10 w-full max-w-md mx-auto lg:max-w-none px-4 sm:px-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
          >
            {/* Main Image with Decorative Border */}
            <div className="relative p-3">
              <div className="absolute inset-0 bg-primary/10 rounded-[3.5rem] rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90" 
                alt="Traveler" 
                className="w-full h-[380px] lg:h-[480px] rounded-[3rem] object-cover shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative z-10 border-[6px] border-white dark:border-navy-light transition-transform duration-700"
              />
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -right-4 top-12 bg-white/90 backdrop-blur-md dark:bg-navy-light/90 p-3 rounded-xl shadow-xl z-20 hidden md:flex items-center gap-3 border border-white/50 dark:border-gray-800"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">New Offer</p>
                  <p className="text-xs font-black text-navy dark:text-white">30% Off Bali</p>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -left-8 bottom-16 bg-white/90 backdrop-blur-md dark:bg-navy-light/90 p-3 rounded-xl shadow-xl z-20 hidden md:flex flex-col gap-2 border border-white/50 dark:border-gray-800"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-navy-light shadow-sm" alt="" />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-gray-500">50+ people just booked!</p>
              </motion.div>
            </div>

            {/* Decors behind image */}
            <div className="absolute -top-8 -right-8 w-full h-full border-[3px] border-secondary/20 rounded-[4rem] -z-20 hidden sm:block rotate-[-3deg]"></div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
