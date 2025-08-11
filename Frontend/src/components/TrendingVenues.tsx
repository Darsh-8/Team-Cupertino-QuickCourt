import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VenueCard from './VenueCard';

const TrendingVenues = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const venues = [
    {
      image: "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Urban Sports Hub",
      location: "Prahlad Nagar, Ahmedabad",
      rating: 4.9,
      reviewCount: 203,
      amenities: ["Badminton", "Tennis", "Parking"]
    },
    {
      image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Prime Court Complex",
      location: "SG Highway, Ahmedabad",
      rating: 4.8,
      reviewCount: 167,
      amenities: ["Football", "Basketball", "Cafe"]
    },
    {
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Elite Fitness Arena",
      location: "Thaltej, Ahmedabad",
      rating: 4.7,
      reviewCount: 189,
      amenities: ["Swimming", "Gym", "Shower"]
    },
    {
      image: "https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Victory Sports Center",
      location: "Navrangpura, Ahmedabad",
      rating: 4.6,
      reviewCount: 142,
      amenities: ["Badminton", "Parking", "AC Court"]
    },
    {
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "TrendSet Sports",
      location: "Vastrapur, Ahmedabad",
      rating: 4.8,
      reviewCount: 201,
      amenities: ["Tennis", "Swimming", "Premium"]
    },
    {
      image: "https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "HotSpot Athletics",
      location: "Bodakdev, Ahmedabad",
      rating: 4.2,
      reviewCount: 156,
      amenities: ["Football", "Basketball", "Cafe"]
    },
    {
      image: "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Peak Performance",
      location: "Thaltej, Ahmedabad",
      rating: 4.6,
      reviewCount: 134,
      amenities: ["Gym", "Badminton", "AC Court"]
    },
    {
      image: "https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "SportZilla Complex",
      location: "Iscon, Ahmedabad",
      rating: 4.5,
      reviewCount: 167,
      amenities: ["Multiple Sports", "Parking", "Shower"]
    },
    {
      image: "https://images.pexels.com/photos/6253559/pexels-photo-6253559.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Champions Arena",
      location: "Ellisbridge, Ahmedabad",
      rating: 4.4,
      reviewCount: 98,
      amenities: ["Tennis", "Squash", "Premium"]
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 680; // Scroll 2-3 cards at once
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">Trending Venues</h2>
          <a 
            href="#" 
            className="text-rose-500 hover:text-rose-600 font-medium hover:underline transition-all flex items-center space-x-1"
          >
            <span>See all trending</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Desktop Layout with Side Navigation */}
        <div className="hidden md:block relative">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center border border-gray-100 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center border border-gray-100 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Venue Grid */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 items-stretch"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {venues.map((venue, index) => (
              <div key={index} style={{ scrollSnapAlign: 'start' }}>
                <VenueCard {...venue} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 items-stretch" style={{ scrollSnapType: 'x mandatory' }}>
            {venues.map((venue, index) => (
              <div key={index} style={{ scrollSnapAlign: 'start' }}>
                <VenueCard {...venue} />
              </div>
            ))}
          </div>
          
          {/* Mobile Scroll Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: Math.ceil(venues.length / 1.3) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors hover:bg-rose-500"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrendingVenues;