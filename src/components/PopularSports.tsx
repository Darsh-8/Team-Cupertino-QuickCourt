import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SportCard from './SportCard';

const PopularSports = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const sports = [
    {
      image: "https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Badminton",
      description: "Indoor racquet sport"
    },
    {
      image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Football",
      description: "Team sport on field"
    },
    {
      image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Cricket",
      description: "Bat and ball sport"
    },
    {
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Swimming",
      description: "Water sport activity"
    },
    {
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Tennis",
      description: "Racquet sport on court"
    },
    {
      image: "https://images.pexels.com/photos/6253559/pexels-photo-6253559.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Table Tennis",
      description: "Indoor paddle sport"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSportClick = (sportName: string) => {
    navigate(`/search?sport=${encodeURIComponent(sportName)}`);
  };

  return (
    <section id="sports" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">Popular Sports</h2>
          
          {/* Navigation Controls */}
          <div className="hidden md:flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>
        </div>

        {/* Sports Carousel */}
        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sports.map((sport, index) => (
            <div key={index} onClick={() => handleSportClick(sport.name)}>
              <SportCard {...sport} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-8 md:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(sports.length / 2) }).map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSports;