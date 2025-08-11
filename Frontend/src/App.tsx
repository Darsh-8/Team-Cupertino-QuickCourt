import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import VenueShowcase from './components/VenueShowcase';
import TrendingVenues from './components/TrendingVenues';
import PopularSports from './components/PopularSports';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
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
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;