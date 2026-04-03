import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Compass } from 'lucide-react';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return Toast.error("Please fill in all fields");
    
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      Toast.success("Welcome back to Travelworld!");
    } catch (err) {
      // Handled by rejected case and state error, but toast for UX
      Toast.error(typeof err === 'string' ? err : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy-dark overflow-hidden sticky top-0 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-bold font-heading leading-tight mb-4">
            Welcome back<br/>to your travel journal.
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            Pick up where you left off, discover new destinations, and connect with fellow explorers.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-navy-dark min-h-screen relative">
        <div className="absolute top-8 left-8 right-8 flex justify-end items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        
        <div className="w-full max-w-md mt-16 lg:mt-0">
          <div className="text-center lg:text-left mb-10">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-navy dark:text-white">
                Travel<span className="text-primary">world</span>
              </span>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-navy dark:text-white mb-3">Sign in to your account</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your email and password to access your trips.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-100 text-sm font-medium">
              {typeof error === 'string' ? error : 'Invalid credentials. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-navy dark:border-gray-700 dark:text-white transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-navy dark:border-gray-700 dark:text-white transition-shadow"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none bg-transparent"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <hr className="w-full border-gray-200 dark:border-gray-700" />
            <span className="px-4 text-sm text-gray-500 font-medium whitespace-nowrap">Or continue with</span>
            <hr className="w-full border-gray-200 dark:border-gray-700" />
          </div>

          <button className="w-full mt-6 bg-white dark:bg-navy border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>

          <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-primary-dark">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
