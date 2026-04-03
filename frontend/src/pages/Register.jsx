import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Compass } from 'lucide-react';
import Toast from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      let strength = 0;
      if (value.length > 5) strength++;
      if (value.length > 7) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(Math.min(4, strength));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return Toast.error("Please fill in all fields");
    }
    if (formData.password !== formData.confirmPassword) return Toast.error("Passwords do not match");
    if (formData.password.length < 8) return Toast.error("Password must be at least 8 characters");
    if (!agreed) return Toast.error("Please agree to the Terms and Privacy Policy");

    const names = formData.fullName.split(' ');
    const first_name = names[0];
    const last_name = names.slice(1).join(' ');

    try {
      await dispatch(registerUser({
        first_name,
        last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword
      })).unwrap();
      Toast.success("Account created successfully!");
    } catch (err) {
      if (typeof err === 'object') {
        const msgs = Object.values(err).flat();
        Toast.error(msgs[0] || 'Registration failed');
      } else {
        Toast.error('Registration failed');
      }
    }
  };

  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const getStrengthWord = () => ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-dark overflow-hidden sticky top-0 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Register background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-bold font-heading leading-tight mb-4">
            Start your journey<br/>with us today.
          </h2>
          <p className="text-gray-200 text-lg max-w-md">
            Join thousands of travelers sharing their experiences and finding their next adventure.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-navy-dark min-h-screen relative overflow-y-auto">
        <div className="absolute top-8 left-8 right-8 flex justify-end items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        
        <div className="w-full max-w-md mt-16 lg:mt-8">
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-navy dark:text-white">
                Travel<span className="text-primary">world</span>
              </span>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-navy dark:text-white mb-2">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join the community and start your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <input 
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe"
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-navy dark:border-gray-700 dark:text-white transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-navy dark:border-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-navy dark:border-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-navy dark:border-gray-700 dark:text-white transition-shadow"
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1 h-1">
                    {[1,2,3,4].map(level => (
                      <div key={level} className={`flex-1 rounded-full ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-gray-200 dark:bg-gray-700'} transition-all duration-300`}></div>
                    ))}
                  </div>
                  <span className={`text-xs font-medium w-12 text-right ${passwordStrength === 4 ? 'text-green-500' : 'text-gray-500'}`}>
                    {getStrengthWord()}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-navy dark:border-gray-700 dark:text-white transition-shadow"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreed} 
                onChange={() => setAgreed(!agreed)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-navy dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                I agree to Travelworld's <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:text-primary-dark">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
