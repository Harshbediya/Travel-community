import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ChevronDown, User as UserIcon, Globe, Compass } from 'lucide-react';
import { logout } from '../store/authSlice';
import { Menu as HeadlessMenu, Transition, TransitionChild } from '@headlessui/react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar completely on authentication pages for a clean split-screen layout
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navLinks = [
    { name: 'Destinations', path: '/destinations' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Community', path: '/community' },
    { name: 'Bookings', path: '/bookings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.05)] py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <div className="relative w-11 h-11 flex items-center justify-center bg-primary rounded-2xl shadow-xl shadow-primary/20 group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
            <Compass className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-heading font-black text-2xl tracking-tight text-navy dark:text-white leading-none">
              Travel<span className="text-primary">world</span>
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] leading-none ml-0.5 mt-1">Explore More</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[16px] font-bold transition-all duration-300 relative group ${
                  location.pathname === link.path ? 'text-primary' : 'text-navy/70 hover:text-primary'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 border-l border-gray-200 pl-8 ml-2">
            {token ? (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center gap-3 focus:outline-none group bg-gray-50 p-1.5 pr-3 rounded-2xl border border-gray-100 hover:border-primary transition-all">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-black text-navy leading-none mb-0.5">{user?.username}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Traveler</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </HeadlessMenu.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95 translate-y-2"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100 translate-y-0"
                  leaveTo="transform opacity-0 scale-95 translate-y-2"
                >
                  <HeadlessMenu.Items className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-3 border border-gray-100 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Account</p>
                      <p className="text-sm font-black text-navy truncate">{user?.email}</p>
                    </div>
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link to={`/profile/${user?.username}`} className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-navy/70'}`}>
                          <UserIcon className="w-4 h-4" /> Profile
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <button onClick={handleLogout} className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold transition-colors text-red-500 ${active ? 'bg-red-50' : ''}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Logout
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="font-bold text-[16px] text-navy/70 hover:text-primary transition-all">Login</Link>
                <Link to="/register" className="bg-navy hover:bg-navy-light text-white px-7 py-3 rounded-2xl font-bold text-[15px] shadow-lg shadow-navy/20 hover:scale-105 active:scale-95 transition-all">Sign up</Link>
              </div>
            )}
            
            <button className="flex items-center gap-2 text-navy/70 font-bold text-[15px] hover:text-primary transition-colors bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <Globe className="w-4 h-4" />
              EN <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-navy">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-transform duration-300 origin-top ${mobileMenuOpen ? 'scale-y-100' : 'scale-y-0'}`}>
        <div className="flex flex-col px-4 pt-4 pb-6 gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-navy dark:text-white border-b dark:border-gray-800 pb-2">
              {link.name}
            </Link>
          ))}
          {token ? (
            <>
              <Link to={`/profile/${user?.username}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-navy dark:text-white border-b dark:border-gray-800 pb-2">
                Profile
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-lg font-bold text-red-500 text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-navy dark:text-white border-b dark:border-gray-800 pb-2">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white text-center py-3 rounded-xl font-bold">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
