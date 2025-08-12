import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'customer';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavigationItems = () => {
    if (!isAuthenticated) return [
      { name: 'SEARCH VENUES', href: '/search' },
      { name: 'BROWSE SPORTS', href: '/#sports' }
    ];
    
    switch (userRole) {
      case 'customer':
        return [
          { name: 'SEARCH', href: '/search' },
          { name: 'MY BOOKINGS', href: '/profile/bookings' },
          { name: 'PROFILE', href: '/profile' }
        ];
      case 'owner':
        return [
          { name: 'DASHBOARD', href: '/owner-dashboard' },
          { name: 'MY VENUES', href: '/owner/venues' },
          { name: 'BOOKINGS', href: '/owner/bookings' },
          { name: 'ANALYTICS', href: '/owner/analytics' }
        ];
      case 'admin':
        return [
          { name: 'DASHBOARD', href: '/admin-dashboard' },
          { name: 'USERS', href: '/admin/users' },
          { name: 'VENUES', href: '/admin/venues' },
          { name: 'ANALYTICS', href: '/admin/analytics' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-16">
            {/* Logo Section */}
            <button 
              onClick={() => navigate(isAuthenticated && userRole !== 'customer' ? `/${userRole}-dashboard` : '/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Zap className="w-6 h-6 text-rose-500" />
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                QUICKCOURT
              </h1>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Slide-out Menu */}
        <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20 space-y-6 relative z-10">
            {/* Navigation */}
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Quick Access Links */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Access</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      navigate('/search');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-rose-500 transition-colors py-1"
                  >
                    Browse All Venues
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/search?sort=popular');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-rose-500 transition-colors py-1"
                  >
                    Popular Venues
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/search?rating=4.5');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-rose-500 transition-colors py-1"
                  >
                    Top Rated
                  </button>
                </div>
              </div>
            </nav>
            
            {/* Authentication */}
            <div className="border-t pt-6 space-y-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-200 tracking-wide uppercase"
                  >
                    SIGN UP
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  {userRole !== 'customer' && (
                    <button 
                      onClick={() => {
                        navigate(`/${userRole}-dashboard`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                    >
                      DASHBOARD
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      localStorage.removeItem('isAuthenticated');
                      localStorage.removeItem('userEmail');
                      localStorage.removeItem('userRole');
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors py-2 tracking-wide uppercase"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
};

export default Header;