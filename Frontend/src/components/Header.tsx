import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'VENUES', href: '/venues' },
    { name: 'SPORTS', href: '/sports' },
    { name: 'BOOK', href: '/book' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PRICING', href: '/pricing' },
    { name: 'SUPPORT', href: '/support' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-rose-500" />
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                QUICKCOURT
              </h1>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-item text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 tracking-wide uppercase relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-rose-500 transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </a>
              ))}
            </div>

            {/* Desktop Authentication Section */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-4 py-2 tracking-wide uppercase">
                LOGIN
              </button>
              <button className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md tracking-wide uppercase">
                SIGN UP
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

        {/* Mobile Slide-out Menu */}
        <div className={`lg:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20 space-y-6">
            {/* Mobile Navigation */}
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            {/* Mobile Authentication */}
            <div className="border-t pt-6 space-y-4">
              <button 
                className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LOGIN
              </button>
              <button 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-200 tracking-wide uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
};

export default Header;