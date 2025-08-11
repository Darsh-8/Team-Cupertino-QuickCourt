import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield,
  Users,
  Building2,
  TrendingUp,
  IndianRupee,
  Star,
  Globe,
  Activity,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Search,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Mock admin data
  const adminData = {
    name: 'System Admin',
    email: 'admin@quickcourt.com',
    totalUsers: 2847,
    totalVenues: 247,
    totalRevenue: 8945670,
    platformRating: 4.7,
    activeUsers: 1892,
    pendingApprovals: 15
  };

  // Mock platform stats
  const platformStats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+23%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Venues',
      value: '247',
      change: '+12%',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: '₹89,45,670',
      change: '+28%',
      icon: IndianRupee,
      color: 'rose'
    },
    {
      title: 'Platform Rating',
      value: '4.7',
      change: '+0.2',
      icon: Star,
      color: 'yellow'
    }
  ];

  // Mock recent users
  const recentUsers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      role: 'customer',
      joinDate: '2025-01-20',
      status: 'active',
      bookings: 12
    },
    {
      id: 2,
      name: 'Sports Arena Owner',
      email: 'arena@example.com',
      role: 'owner',
      joinDate: '2025-01-18',
      status: 'pending',
      venues: 2
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'customer',
      joinDate: '2025-01-15',
      status: 'active',
      bookings: 8
    }
  ];

  // Mock venues for approval
  const pendingVenues = [
    {
      id: 1,
      name: 'New Sports Complex',
      owner: 'John Doe',
      location: 'Mumbai, Maharashtra',
      sports: ['Badminton', 'Tennis'],
      submittedDate: '2025-01-22',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Elite Fitness Center',
      owner: 'Jane Smith',
      location: 'Delhi, NCR',
      sports: ['Gym', 'Swimming'],
      submittedDate: '2025-01-21',
      status: 'under_review'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'under_review':
        return <AlertTriangle className="w-4 h-4" />;
      case 'suspended':
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const DashboardOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to QuickCourt Admin Panel, {adminData.name}! ⚡</h1>
            <p className="text-purple-100 mb-4">Oversee QuickCourt platform operations and settings</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>25 Cities</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>Platform Health: Excellent</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(adminData.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="text-purple-100 text-sm">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
                <div className="text-xs text-green-600 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change} this month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent User Registrations</h2>
            <div className="flex space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span>{user.status}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>{user.email}</div>
                    <div className="capitalize">{user.role}</div>
                    <div>Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                    <div>
                      {user.role === 'customer' ? `${user.bookings} bookings` : `${user.venues} venues`}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {user.status === 'pending' && (
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Venue Approvals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Pending Venue Approvals</h2>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
              {pendingVenues.length} pending
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingVenues.map((venue) => (
            <div key={venue.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(venue.status)}`}>
                      {getStatusIcon(venue.status)}
                      <span>{venue.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>Owner: {venue.owner}</div>
                    <div>{venue.location}</div>
                    <div>{venue.sports.join(', ')}</div>
                    <div>Submitted: {new Date(venue.submittedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors">
                    Review
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
          <p className="text-sm text-gray-600">Manage platform users and permissions</p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Venue Oversight</h3>
          <p className="text-sm text-gray-600">Review and approve venue listings</p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Platform Analytics</h3>
          <p className="text-sm text-gray-600">View comprehensive platform metrics</p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <Settings className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Global Settings</h3>
          <p className="text-sm text-gray-600">Configure QuickCourt platform settings</p>
        </button>
      </div>
    </div>
  );

  const AdminSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
              <input
                type="text"
                defaultValue={adminData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                defaultValue={adminData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
              Save Changes
            </button>
          </div>
          
          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-200">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Dashboard', icon: Activity },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'venues', label: 'Venues', icon: Building2 },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
        {activeTab === 'settings' && <AdminSettings />}
        {(activeTab === 'users' || activeTab === 'venues' || activeTab === 'analytics') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;