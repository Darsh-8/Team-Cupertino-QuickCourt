import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Camera,
  Upload,
  Shield,
  Bell,
  Globe,
  Gift,
  Users,
  Clock,
  DollarSign,
  Star,
  Zap
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Account Setup
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    emailVerified: false,
    
    // Step 2 - Personal Information
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+91',
    dateOfBirth: '',
    gender: '',
    profilePhoto: null as File | null,
    phoneVerified: false,
    
    // Step 3 - Location & Preferences
    location: '',
    searchRadius: 10,
    favoriteSports: [] as string[],
    skillLevels: {} as {[key: string]: string},
    preferredTimes: [] as string[],
    budgetRange: [500, 2000],
    
    // Step 4 - Settings & Verification
    notifications: {
      bookingConfirmations: true,
      promotions: true,
      reminders: true,
      friendActivity: false,
      venueUpdates: true
    },
    marketingConsent: false,
    referralCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const sports = [
    { name: 'Badminton', icon: '🏸', popular: true },
    { name: 'Tennis', icon: '🎾', popular: true },
    { name: 'Football', icon: '⚽', popular: true },
    { name: 'Basketball', icon: '🏀', popular: true },
    { name: 'Cricket', icon: '🏏', popular: true },
    { name: 'Swimming', icon: '🏊', popular: false },
    { name: 'Table Tennis', icon: '🏓', popular: false },
    { name: 'Volleyball', icon: '🏐', popular: false },
    { name: 'Squash', icon: '🎾', popular: false },
    { name: 'Boxing', icon: '🥊', popular: false }
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12PM - 6PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (6PM - 10PM)', icon: '🌆' },
    { id: 'night', label: 'Night (10PM - 12AM)', icon: '🌙' }
  ];

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...(prev[name as keyof typeof prev] as string[]), value]
        : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleNestedChange = (parent: string, child: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as object),
        [child]: value
      }
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    switch (step) {
      case 1:
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        break;
        
      case 2:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
        
      case 3:
        if (!formData.location) newErrors.location = 'Location is required';
        if (formData.favoriteSports.length === 0) newErrors.favoriteSports = 'Select at least one sport';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Set authentication status with default user role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
    }, 2000);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step <= currentStep 
              ? 'bg-rose-500 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-rose-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-600">Set up your login credentials</p>
      </div>

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
            errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
            errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Password Strength Meter */}
      {formData.password && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength < 50 ? 'bg-red-500' : 
                  passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className={formData.password.length >= 8 ? 'text-green-600' : ''}>
              ✓ At least 8 characters
            </div>
            <div className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
              ✓ One uppercase letter
            </div>
            <div className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
              ✓ One number
            </div>
            <div className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}>
              ✓ One special character
            </div>
          </div>
        </div>
      )}

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {/* Terms Agreement */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <button className="text-rose-500 hover:text-rose-600 underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-rose-500 hover:text-rose-600 underline">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {formData.profilePhoto ? (
              <img 
                src={URL.createObjectURL(formData.profilePhoto)} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
            }`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
            }`}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      {/* Phone Number */}
      <div className="flex space-x-2">
        <select
          name="countryCode"
          value={formData.countryCode}
          onChange={handleInputChange}
          className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
        </select>
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.dateOfBirth ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
          }`}
        />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender (Optional)</label>
        <div className="grid grid-cols-3 gap-3">
          {['Male', 'Female', 'Other'].map((gender) => (
            <label key={gender} className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={handleInputChange}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">{gender}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Preferences</h2>
        <p className="text-gray-600">Help us personalize your experience</p>
      </div>

      {/* Location */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Your location (City, State)"
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.location ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-rose-500'
          }`}
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Search Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Radius: {formData.searchRadius} km
        </label>
        <input
          type="range"
          name="searchRadius"
          min="1"
          max="50"
          value={formData.searchRadius}
          onChange={handleInputChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Favorite Sports */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Favorite Sports {errors.favoriteSports && <span className="text-red-600">*</span>}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {sports.map((sport) => (
            <label key={sport.name} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.favoriteSports.includes(sport.name)}
                onChange={(e) => handleArrayChange('favoriteSports', sport.name, e.target.checked)}
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-lg">{sport.icon}</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{sport.name}</span>
                {sport.popular && <span className="ml-2 text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">Popular</span>}
              </div>
            </label>
          ))}
        </div>
        {errors.favoriteSports && <p className="mt-1 text-sm text-red-600">{errors.favoriteSports}</p>}
      </div>

      {/* Preferred Playing Times */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Playing Times</label>
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <label key={slot.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preferredTimes.includes(slot.id)}
                onChange={(e) => handleArrayChange('preferredTimes', slot.id, e.target.checked)}
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-lg">{slot.icon}</span>
              <span className="text-sm font-medium text-gray-900">{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range: ₹{formData.budgetRange[0]} - ₹{formData.budgetRange[1]} per hour
        </label>
        <div className="px-3">
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={formData.budgetRange[1]}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              budgetRange: [prev.budgetRange[0], parseInt(e.target.value)]
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings & Verification</h2>
        <p className="text-gray-600">Customize your experience</p>
      </div>

      {/* Notification Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notification Preferences</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(formData.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-xs text-gray-600">
                  {key === 'bookingConfirmations' && 'Get notified when bookings are confirmed'}
                  {key === 'promotions' && 'Receive special offers and discounts'}
                  {key === 'reminders' && 'Booking reminders and check-in notifications'}
                  {key === 'friendActivity' && 'Updates about your friends\' activities'}
                  {key === 'venueUpdates' && 'News and updates from your favorite venues'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNestedChange('notifications', key, e.target.checked)}
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Marketing Consent */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleInputChange}
            className="mt-1 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">Marketing Communications</span>
            <p className="text-xs text-gray-600 mt-1">
              I agree to receive marketing emails about new venues, special offers, and sports events. 
              You can unsubscribe at any time.
            </p>
          </div>
        </label>
      </div>

      {/* Referral Code */}
      <div className="relative">
        <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleInputChange}
          placeholder="Referral code (optional)"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <p className="mt-1 text-xs text-gray-600">
          Have a referral code? Enter it here to get bonus credits!
        </p>
      </div>

      {/* Account Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Account Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-900">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="text-gray-900">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="text-gray-900">{formData.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Favorite Sports:</span>
            <span className="text-gray-900">{formData.favoriteSports.length} selected</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-rose-500 mb-6">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900">QUICKCOURT</span>
          </Link>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-lg font-semibold transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-500 hover:text-rose-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;