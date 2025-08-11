import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HeroSection from './components/HeroSection';
import VenueShowcase from './components/VenueShowcase';
import TrendingVenues from './components/TrendingVenues';
import PopularSports from './components/PopularSports';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import VenueDetail from './pages/VenueDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

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
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        } />
        <Route path="/venue/:id" element={
          <ProtectedRoute>
            <VenueDetail />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
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