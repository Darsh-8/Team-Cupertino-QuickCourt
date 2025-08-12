import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Heart,
  CreditCard,
  Bell,
  Shield,
  Settings,
  LogOut,
  Edit,
  Camera,
  Eye,
  ChevronRight,
  Clock,
  TrendingUp,
  Award,
  Gift,
  IndianRupee,
  Trash2,
  Plus
} from 'lucide-react';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    promotions: false,
    venueUpdates: true,
    emailNotifications: true
  });
  
  // Get user data from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'customer@quickcourt.com';
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Mock user data
  const user = {
    name: 'Rajesh Kumar',
    email: userEmail,
    phone: '+91 98765 43210',
    location: 'Ahmedabad, Gujarat',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    memberSince: '2023',
    totalBookings: 47,
    totalSpent: 28500,
    favoriteVenues: 12,
    averageRating: 4.8,
    loyaltyPoints: 1250
  };

  // Mock upcoming bookings
  const upcomingBookings = [
    {
      id: 1,
      venue: 'Elite Sports Arena',
      sport: 'Badminton',
      date: '2025-01-25',
      time: '18:00',
      image: 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Satellite, Ahmedabad',
      price: 1200
    },
    {
      id: 2,
      venue: 'Champions Club',
      sport: 'Tennis',
      date: '2025-01-27',
      time: '07:00',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Bopal, Ahmedabad',
      price: 1800
    }
  ];

  // Mock favorite venues
  const favoriteVenues = [
    {
      id: 1,
      name: 'Elite Sports Arena',
      image: 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      visits: 12,
      sports: ['Badminton', 'Tennis']
    },
    {
      id: 2,
      name: 'Champions Club',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      visits: 8,
      sports: ['Tennis', 'Swimming']
    }
  ];

  const ProfileOverview = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
            />
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-gray-100 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-rose-100">{user.email}</p>
            <p className="text-rose-200 text-sm">Member since {user.memberSince}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{user.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">₹{user.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{user.favoriteVenues}</div>
              <div className="text-sm text-gray-600">Favorite Venues</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{user.loyaltyPoints}</div>
              <div className="text-sm text-gray-600">Loyalty Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
            <button 
              onClick={() => navigate('/profile/bookings')}
              className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={booking.image}
                    alt={booking.venue}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.venue}</h3>
                    <div className="text-sm text-gray-600">
                      {booking.sport} • {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </div>
                    <div className="text-sm text-gray-500">{booking.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{booking.price}</div>
                    <button className="text-sm text-rose-500 hover:text-rose-600">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Bookings</h3>
              <p className="text-gray-600 mb-4">Book your next sports session to get started!</p>
              <button 
                onClick={() => setShowAvatarUpload(true)}
                onClick={() => navigate('/search')}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Find Venues
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Venues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Venues</h2>
            <button className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteVenues.map((venue) => (
              <div key={venue.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{venue.rating}</span>
                    <span>•</span>
                    <span>{venue.visits} visits</span>
                  </div>
                  <div className="text-sm text-gray-500">{venue.sports.join(', ')}</div>
                </div>
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PersonalInfo = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue={user.phone}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              defaultValue={user.location}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors">
              Save Changes
            </button>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-gray-600 mt-1">Manage how you receive updates and alerts</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-gray-600">
                  {key === 'bookingReminders' && 'Get notified about upcoming bookings'}
                  {key === 'promotions' && 'Receive special offers and discounts'}
                  {key === 'venueUpdates' && 'Updates from your favorite venues'}
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentMethods = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
            <p className="text-gray-600 mt-1">Manage your saved payment options</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Mock payment methods */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Add a payment method to make booking easier</p>
          </div>
        </div>
      </div>
    </div>
  );

  const BookingHistory = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.image}
                    alt={booking.venue}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.venue}</h3>
                    <p className="text-sm text-gray-600">{booking.sport}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{booking.price}</p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm text-rose-500 border border-rose-500 rounded hover:bg-rose-50 transition-colors">
                      Cancel
                    </button>
                    <button className="px-3 py-1 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start booking venues to see your history here</p>
            <button 
              onClick={() => navigate('/search')}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Venues
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Avatar Upload Modal
  const AvatarUploadModal = () => (
    showAvatarUpload && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Avatar</h3>
          <div className="text-center mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
              Choose New Photo
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAvatarUpload(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowAvatarUpload(false)}
              className="flex-1 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'favorites', label: 'Favorite Venues', icon: Heart },
              { id: 'personal', label: 'Personal Info', icon: Settings },
              { id: 'payments', label: 'Payment Methods', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-rose-500 text-rose-600'
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
        {activeSection === 'overview' && <ProfileOverview />}
        {activeSection === 'personal' && <PersonalInfo />}
        {activeSection === 'bookings' && <BookingHistory />}
        {activeSection === 'payments' && <PaymentMethods />}
        {activeSection === 'notifications' && <NotificationSettings />}
        {activeSection === 'favorites' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </div>
      
      {/* Avatar Upload Modal */}
      <AvatarUploadModal />
    </div>
  );
};

export default CustomerProfile;