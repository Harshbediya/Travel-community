import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 px-4 mt-auto w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12 xl:gap-8 mb-16">
        
        {/* Col 1 */}
        <div className="xl:col-span-1">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-navy">
              Travel<span className="text-primary">world</span>
            </span>
          </Link>
          <p className="text-muted font-medium text-[15px] leading-snug pr-4">
            Book your trip in minute, get full <br /> Control for much longer.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-[#080809] font-bold text-xl mb-6">Company</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">About</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Careers</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Mobile</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-[#080809] font-bold text-xl mb-6">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Help/FAQ</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Press</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Affiliates</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-[#080809] font-bold text-xl mb-6">More</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Airlinefees</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Airline</Link></li>
            <li><Link to="#" className="text-muted font-medium hover:text-primary transition-colors">Low fare tips</Link></li>
          </ul>
        </div>

        {/* Col 5 (Social & App) */}
        <div className="xl:col-span-1">
          <div className="flex gap-4 mb-8">
            <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#080809] hover:bg-gradient-to-tr hover:from-[#B16CF4] hover:to-[#55A1F7] hover:text-white transition-all">
              <Facebook className="fill-current w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white bg-gradient-to-tr from-[#B16CF4] to-[#55A1F7] hover:opacity-90 transition-opacity">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#080809] hover:bg-gradient-to-tr hover:from-[#B16CF4] hover:to-[#55A1F7] hover:text-white transition-all">
              <Twitter className="fill-current w-5 h-5" />
            </a>
          </div>
          
          <h4 className="text-muted font-medium text-lg mb-4 tracking-wide">Discover our app</h4>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-black text-white rounded-[30px] px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer w-[140px]">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13.593 12L9.229 16.363l1.414 1.414 5.778-5.777-5.778-5.777-1.414 1.414L13.593 12z"/></svg>
               <div className="text-left">
                 <p className="text-[10px] leading-tight text-white/70">GET IT ON</p>
                 <p className="text-[13px] font-bold leading-tight">GOOGLE PLAY</p>
               </div>
            </button>
            <button className="bg-black text-white rounded-[30px] px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer w-[140px]">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5c0 .66-1.5 1.5-1.5 1.5s-1.5-.84-1.5-1.5V6s1.5-1.5 1.5-1.5S13 5.34 13 6v10.5z"/></svg>
               <div className="text-left">
                 <p className="text-[10px] leading-tight text-white/70">Available on the</p>
                 <p className="text-[13px] font-bold leading-tight">Apple Store</p>
               </div>
            </button>
          </div>
        </div>

      </div>

      <div className="text-center pt-8 text-muted font-medium text-sm">
        <p>All rights reserved@travelworld.co</p>
      </div>
    </footer>
  );
};

export default Footer;
