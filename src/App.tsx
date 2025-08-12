import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CustomerProfile from './pages/CustomerProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HeroSection from './components/HeroSection';
import VenueShowcase from './components/VenueShowcase';
import TrendingVenues from './components/TrendingVenues';
import PopularSports from './components/PopularSports';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import VenueDetail from './pages/VenueDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <VenueShowcase />
            <TrendingVenues />
            <PopularSports />
          </>
        } />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/bookings" element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/owner-dashboard" element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;