import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Clock, Users, Plus, Minus, Zap, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [playerCount, setPlayerCount] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (selectedSport) searchParams.set('sport', selectedSport);
    if (selectedLocation) searchParams.set('location', selectedLocation);
    if (selectedTime) searchParams.set('time', selectedTime);
    if (playerCount > 1) searchParams.set('players', playerCount.toString());
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <section className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl text-gray-900 mb-6 tracking-tight feature-font">
            Find Players & Venues
            <br />
            Nearby
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Seamlessly explore sports venues and play with sports enthusiasts just like you!
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white md:rounded-full rounded-xl shadow-lg border border-gray-200 md:p-2 p-6 hover:shadow-xl transition-shadow duration-300 relative">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
              {/* What Section - Sport Selection */}
              <div 
                className={`flex-1 md:p-4 p-3 md:rounded-full rounded-lg cursor-pointer transition-colors min-w-0 relative ${
                  activeSection === 'what' ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'what' ? '' : 'what')}
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                      What
                    </label>
                    <div className="text-base text-gray-700">
                      {selectedSport || <span className="text-gray-400">Choose sport</span>}
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 md:hidden" />
                </div>
                
                {/* Sport Dropdown */}
                {activeSection === 'what' && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Badminton', icon: '🏸' },
                        { name: 'Tennis', icon: '🎾' },
                        { name: 'Football', icon: '⚽' },
                        { name: 'Basketball', icon: '🏀' },
                        { name: 'Cricket', icon: '🏏' },
                        { name: 'Swimming', icon: '🏊' },
                        { name: 'Table Tennis', icon: '🏓' },
                        { name: 'Volleyball', icon: '🏐' }
                      ].map((sport) => (
                        <button
                          key={sport.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSport(sport.name);
                            setActiveSection('');
                          }}
                          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="text-lg">{sport.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{sport.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-4"></div>

              {/* Where Section - Location */}
              <div 
                className={`flex-1 md:p-4 p-3 md:rounded-full rounded-lg cursor-pointer transition-colors min-w-0 relative ${
                  activeSection === 'where' ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'where' ? '' : 'where')}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                      Where
                    </label>
                    <div className="text-base text-gray-700">
                      {selectedLocation || <span className="text-gray-400">Search locations</span>}
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 md:hidden" />
                </div>
                
                {/* Location Dropdown */}
                {activeSection === 'where' && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocation('Near me');
                          setActiveSection('');
                        }}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span className="text-sm font-medium text-gray-900">Near me</span>
                      </button>
                      {[
                        'Ahmedabad, Gujarat',
                        'Mumbai, Maharashtra', 
                        'Delhi, NCR',
                        'Bangalore, Karnataka',
                        'Pune, Maharashtra'
                      ].map((location) => (
                        <button
                          key={location}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(location);
                            setActiveSection('');
                          }}
                          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{location}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-4"></div>

              {/* When Section */}
              <div 
                className={`flex-1 md:p-4 p-3 md:rounded-full rounded-lg cursor-pointer transition-colors min-w-0 relative ${
                  activeSection === 'when' ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'when' ? '' : 'when')}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                      When
                    </label>
                    <div className="text-base text-gray-700">
                      {selectedTime || <span className="text-gray-400">Add time</span>}
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 md:hidden" />
                </div>
                
                {/* Time Dropdown */}
                {activeSection === 'when' && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Time Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['Morning', 'Afternoon', 'Evening', 'Night'].map((option) => (
                            <button
                              key={option}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTime(option);
                                setActiveSection('');
                              }}
                              className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Time Slots</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['9-12 AM', '12-3 PM', '3-6 PM', '6-9 PM'].map((slot) => (
                            <button
                              key={slot}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTime(slot);
                                setActiveSection('');
                              }}
                              className="p-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-4"></div>

              {/* How Many Section - Player Count */}
              <div 
                className={`hidden md:block flex-1 p-4 rounded-full cursor-pointer transition-colors min-w-0 ${
                  activeSection === 'players' ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'players' ? '' : 'players')}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                      How many
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {playerCount === 1 ? '1 player' : `${playerCount} players`}
                      </span>
                      {activeSection !== 'players' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayerCount(Math.max(1, playerCount - 1));
                            }}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayerCount(Math.min(20, playerCount + 1));
                            }}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Player Count Dropdown */}
                {activeSection === 'players' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Number of Players</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Players</span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayerCount(Math.max(1, playerCount - 1));
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                              {playerCount}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayerCount(Math.min(20, playerCount + 1));
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {selectedSport && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Common for {selectedSport}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedSport === 'Tennis' || selectedSport === 'Badminton' ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(2);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  Singles (2)
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(4);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  Doubles (4)
                                </button>
                              </>
                            ) : selectedSport === 'Football' ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(10);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  5v5 (10)
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(14);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  7v7 (14)
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(2);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  Small (2-4)
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerCount(8);
                                    setActiveSection('');
                                  }}
                                  className="p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                                >
                                  Group (6-10)
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="bg-rose-500 hover:bg-rose-600 text-white md:p-4 p-4 md:rounded-full rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-500/20 w-full md:w-auto flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span className="md:hidden font-semibold">Search</span>
              </button>
            </div>
          </div>
          
          {/* Click outside to close dropdowns */}
          {activeSection && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setActiveSection('')}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;