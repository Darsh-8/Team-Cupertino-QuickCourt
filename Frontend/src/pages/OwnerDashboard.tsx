import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2,
  Calendar,
  TrendingUp,
  Users,
  IndianRupee,
  Star,
  MapPin,
  Clock,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Bell,
  X,
  Zap,
  Target,
  Award,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Phone,
  Mail,
  MessageCircle,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', message: 'New booking at Elite Sports Arena', time: '5 min ago', read: false },
    { id: 2, type: 'payment', message: 'Payment received: ₹2,400', time: '1 hour ago', read: false },
    { id: 3, type: 'review', message: 'New 5-star review received', time: '2 hours ago', read: true }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const analyticsRef = useRef<HTMLDivElement>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Good Morning', icon: <Sunrise className="w-6 h-6" /> };
    if (hour < 17) return { greeting: 'Good Afternoon', icon: <Sun className="w-6 h-6" /> };
    if (hour < 21) return { greeting: 'Good Evening', icon: <Sunset className="w-6 h-6" /> };
    return { greeting: 'Good Night', icon: <Moon className="w-6 h-6" /> };
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mock owner data with enhanced metrics
  const ownerData = {
    name: 'Venue Owner',
    email: 'owner@quickcourt.com',
    totalVenues: 4,
    monthlyRevenue: 245600,
    totalBookings: 156,
    averageRating: 4.8,
    activeVenues: 4,
    pendingBookings: 12,
    occupancyRate: 78,
    customerSatisfaction: 94,
    monthlyGrowth: 15.2,
    yearlyGrowth: 28.5
  };

  // Enhanced venues data with more metrics
  const venues = [
    {
      id: 1,
      name: 'Elite Sports Arena',
      location: 'Satellite, Ahmedabad',
      image: 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
      sports: ['Badminton', 'Tennis'],
      rating: 4.8,
      bookingsThisMonth: 45,
      revenue: 67500,
      status: 'active',
      occupancyRate: 85,
      totalReviews: 124,
      amenities: ['Parking', 'WiFi', 'Cafe', 'AC'],
      peakHours: '6-9 PM',
      avgBookingValue: 1500,
      repeatCustomers: 68
    },
    {
      id: 2,
      name: 'Champions Club',
      location: 'Bopal, Ahmedabad',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      sports: ['Tennis', 'Swimming'],
      rating: 4.7,
      bookingsThisMonth: 38,
      revenue: 58200,
      status: 'active',
      occupancyRate: 72,
      totalReviews: 95,
      amenities: ['Parking', 'Cafe', 'Shower', 'AC'],
      peakHours: '7-10 AM',
      avgBookingValue: 1800,
      repeatCustomers: 54
    },
    {
      id: 3,
      name: 'Metro Sports Complex',
      location: 'Makarba, Ahmedabad',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
      sports: ['Football', 'Basketball'],
      rating: 4.6,
      bookingsThisMonth: 42,
      revenue: 63000,
      status: 'active',
      occupancyRate: 78,
      totalReviews: 156,
      amenities: ['Parking', 'Shower', 'Equipment'],
      peakHours: '5-8 PM',
      avgBookingValue: 2400,
      repeatCustomers: 72
    },
    {
      id: 4,
      name: 'AquaZone Pool Club',
      location: 'Prahlad Nagar, Ahmedabad',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      sports: ['Swimming'],
      rating: 4.4,
      bookingsThisMonth: 31,
      revenue: 56900,
      status: 'maintenance',
      occupancyRate: 65,
      totalReviews: 89,
      amenities: ['Parking', 'Cafe', 'Shower', 'Locker'],
      peakHours: '6-9 AM',
      avgBookingValue: 800,
      repeatCustomers: 45
    }
  ];

  // Enhanced recent bookings with more details
  const recentBookings = [
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      customerAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      venue: 'Elite Sports Arena',
      sport: 'Badminton',
      date: '2025-01-25',
      time: '18:00',
      duration: 1,
      amount: 1200,
      status: 'confirmed',
      paymentStatus: 'paid',
      customerType: 'regular',
      bookingSource: 'mobile_app'
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      venue: 'Champions Club',
      sport: 'Tennis',
      date: '2025-01-25',
      time: '07:00',
      duration: 1.5,
      amount: 1800,
      status: 'pending',
      paymentStatus: 'pending',
      customerType: 'new',
      bookingSource: 'website'
    },
    {
      id: 3,
      customerName: 'Amit Patel',
      customerAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
      venue: 'Metro Sports Complex',
      sport: 'Football',
      date: '2025-01-24',
      time: '19:30',
      duration: 2,
      amount: 2400,
      status: 'completed',
      paymentStatus: 'paid',
      customerType: 'vip',
      bookingSource: 'mobile_app'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'maintenance':
        return <AlertCircle className="w-4 h-4" />;
      case 'inactive':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Parking': <Car className="w-4 h-4" />,
      'WiFi': <Wifi className="w-4 h-4" />,
      'Cafe': <Coffee className="w-4 h-4" />,
      'Shower': '🚿',
      'AC': '❄️',
      'Equipment': <Dumbbell className="w-4 h-4" />,
      'Locker': '🔒'
    };
    return iconMap[amenity] || '•';
  };

  const scrollHorizontal = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const DashboardOverview = () => {
    const { greeting, icon } = getTimeBasedGreeting();
    
    return (
      <div className="space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {icon}
                  <h1 className="text-3xl font-bold tracking-tight">{greeting}, {ownerData.name}! 🏟️</h1>
                </div>
                <p className="text-blue-100 text-lg mb-4">Manage your sports venues and track performance</p>
                <div className="flex items-center space-x-6 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{ownerData.activeVenues} Active Venues</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{ownerData.occupancyRate}% Avg Occupancy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{ownerData.averageRating} Rating</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1">₹{(ownerData.monthlyRevenue / 1000).toFixed(0)}K</div>
                <div className="text-blue-200 text-sm mb-2">Monthly Revenue</div>
                <div className="flex items-center space-x-1 text-green-300 text-sm">
                  <ArrowUp className="w-4 h-4" />
                  <span>+{ownerData.monthlyGrowth}% from last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                notification.type === 'booking' ? 'bg-blue-50 border-blue-500' :
                notification.type === 'payment' ? 'bg-green-50 border-green-500' :
                'bg-yellow-50 border-yellow-500'
              } transition-all duration-200 hover:shadow-md`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-rose-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-blue-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{ownerData.totalVenues}</div>
                  <div className="text-blue-200 text-sm">Active Venues</div>
                </div>
              </div>
              <div className="text-blue-200 text-sm">All verified & operational</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-green-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{ownerData.totalBookings}</div>
                  <div className="text-green-200 text-sm">Monthly Bookings</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-200 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{ownerData.monthlyGrowth}% growth</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <IndianRupee className="w-8 h-8 text-rose-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold">₹{(ownerData.monthlyRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-rose-200 text-sm">Monthly Revenue</div>
                </div>
              </div>
              <div className="text-rose-200 text-sm">After 10% platform fee</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{ownerData.averageRating}</div>
                  <div className="text-yellow-200 text-sm">Average Rating</div>
                </div>
              </div>
              <div className="text-yellow-200 text-sm">{ownerData.customerSatisfaction}% satisfaction</div>
            </div>
          </div>
        </div>

        {/* Enhanced My Venues Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Venues</h2>
                <p className="text-gray-600">Manage and monitor your sports facilities</p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add New Venue</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-28 h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -top-2 -right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border ${getStatusColor(venue.status)}`}>
                          {getStatusIcon(venue.status)}
                          <span className="capitalize">{venue.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{venue.name}</h3>
                          <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{venue.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-900">{venue.rating}</span>
                            <span className="text-gray-500 text-sm">({venue.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {venue.sports.map((sport, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {sport}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="font-bold text-gray-900 text-lg">{venue.bookingsThisMonth}</div>
                          <div className="text-gray-600">Bookings</div>
                          <div className="text-xs text-green-600 flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{venue.occupancyRate}% occupied</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="font-bold text-gray-900 text-lg">₹{(venue.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-gray-600">Revenue</div>
                          <div className="text-xs text-blue-600">Avg: ₹{venue.avgBookingValue}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        {venue.amenities.slice(0, 4).map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-1 text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                          Manage
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Bookings</h2>
                <p className="text-gray-600">Latest customer bookings at your venues</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.customerAvatar}
                    alt={booking.customerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-gray-900">{booking.customerName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.customerType === 'vip' ? 'bg-purple-100 text-purple-700' :
                          booking.customerType === 'regular' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {booking.customerType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{booking.venue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>{booking.sport}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time} ({booking.duration}h)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-bold text-gray-900">₹{booking.amount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Source: {booking.bookingSource.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Booked via {booking.bookingSource === 'mobile_app' ? 'Mobile App' : 'Website'}</span>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button className="w-full py-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All Bookings →
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-8 h-8 text-blue-200 group-hover:scale-110 transition-transform" />
              <ChevronRight className="w-5 h-5 text-blue-200" />
            </div>
            <h3 className="font-bold text-lg mb-2">Manage Venues</h3>
            <p className="text-blue-200 text-sm">Update facilities and pricing</p>
          </button>

          <button className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-200 group-hover:scale-110 transition-transform" />
              <ChevronRight className="w-5 h-5 text-green-200" />
            </div>
            <h3 className="font-bold text-lg mb-2">Analytics</h3>
            <p className="text-green-200 text-sm">Track performance & revenue</p>
          </button>

          <button className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-200 group-hover:scale-110 transition-transform" />
              <ChevronRight className="w-5 h-5 text-purple-200" />
            </div>
            <h3 className="font-bold text-lg mb-2">Bookings</h3>
            <p className="text-purple-200 text-sm">View all customer bookings</p>
          </button>

          <button className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <Percent className="w-8 h-8 text-orange-200 group-hover:scale-110 transition-transform" />
              <ChevronRight className="w-5 h-5 text-orange-200" />
            </div>
            <h3 className="font-bold text-lg mb-2">Promotions</h3>
            <p className="text-orange-200 text-sm">Create offers & discounts</p>
          </button>
        </div>
      </div>
    );
  };

  const AnalyticsPage = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
        <p className="text-gray-600 mb-6">Comprehensive analytics dashboard with enhanced visualizations coming soon</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2">Revenue Analytics</h4>
            <p className="text-blue-700 text-sm">Track earnings, trends, and forecasts</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-green-900 mb-2">Booking Insights</h4>
            <p className="text-green-700 text-sm">Analyze booking patterns and optimization</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-semibold text-purple-900 mb-2">Customer Analytics</h4>
            <p className="text-purple-700 text-sm">Understand customer behavior and preferences</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-600">Manage your business profile and preferences</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                defaultValue="Sports Venue Management"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue={ownerData.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
              <input
                type="text"
                defaultValue="Ahmedabad, Gujarat"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors hover:shadow-lg">
              Save Changes
            </button>
          </div>
          
          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Dashboard', icon: Activity },
              { id: 'venues', label: 'My Venues', icon: Building2 },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <ProfileSettings />}
        {(activeTab === 'venues' || activeTab === 'bookings') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development with enhanced features</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;