import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Fingerprint, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  X,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [language, setLanguage] = useState('en');

  // Hero images for carousel
  const heroImages = [
    {
      url: 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Premium Badminton Courts',
      subtitle: 'Professional-grade facilities for every skill level'
    },
    {
      url: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'World-Class Tennis Venues',
      subtitle: 'Book courts at top-rated tennis facilities'
    },
    {
      url: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Football Fields & Pitches',
      subtitle: 'Find the perfect field for your team'
    },
    {
      url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Swimming Pools & Aquatic Centers',
      subtitle: 'Dive into premium aquatic facilities'
    }
  ];

  // Demo credentials
  const demoCredentials = [
    {
      type: 'Customer',
      email: 'customer@quickcourt.com',
      password: 'customer123',
      description: 'Venue booking customer account'
    },
    {
      type: 'Venue Owner',
      email: 'owner@quickcourt.com',
      password: 'owner123',
      description: 'Venue management and analytics access'
    },
    {
      type: 'Admin',
      email: 'admin@quickcourt.com',
      password: 'admin123',
      description: 'Full platform administration access'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Determine user role based on email
      let userRole = 'user';
      let redirectPath = '/';
      
      if (formData.email === 'customer@quickcourt.com') {
        userRole = 'customer';
        redirectPath = '/';
      } else if (formData.email === 'owner@quickcourt.com') {
        userRole = 'owner';
        redirectPath = '/owner-dashboard';
      } else if (formData.email === 'admin@quickcourt.com') {
        userRole = 'admin';
        redirectPath = '/admin-dashboard';
      }
      
      // Set authentication status with role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', userRole);
      
      // Redirect to dashboard  
      navigate(redirectPath);
    }, 2000);
  };

  const copyCredentials = (email: string, password: string, type: string) => {
    navigator.clipboard.writeText(`${email}:${password}`);
    setCopiedCredential(type);
    setTimeout(() => setCopiedCredential(''), 2000);
  };

  const fillCredentials = (email: string, password: string) => {
    setFormData(prev => ({ ...prev, email, password }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const ForgotPasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Reset Password</h3>
          <button
            onClick={() => setShowForgotPassword(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          
          <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition-colors">
            Send Reset Link
          </button>
          
          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Carousel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImageIndex].url}
            alt={heroImages[currentImageIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        
        {/* Carousel Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            {heroImages[currentImageIndex].title}
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            {heroImages[currentImageIndex].subtitle}
          </p>
          
          {/* Carousel Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={prevImage}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 text-rose-500 mb-8">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900">QUICKCOURT</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Demo Credentials Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Demo Credentials</h3>
            </div>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{cred.type}</div>
                    <div className="text-xs text-gray-600">{cred.email}</div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => fillCredentials(cred.email, cred.password)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => copyCredentials(cred.email, cred.password, cred.type)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copiedCredential === cred.type ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">f</div>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold"></div>
              </button>
            </div>
          </div>

          {/* Biometric Login */}
          <button className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Fingerprint className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Use Biometric Login</span>
          </button>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose-500 hover:text-rose-600 font-medium">
                Sign up now
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
              Continue as Guest
            </Link>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="hover:text-gray-700 transition-colors"
            >
              {language === 'en' ? 'Español' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && <ForgotPasswordModal />}
    </div>
  );
};

export default Login;