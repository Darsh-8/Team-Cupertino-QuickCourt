import React, { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  MapPin, 
  Star, 
  Heart, 
  Grid3X3, 
  List, 
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  SlidersHorizontal,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Users,
  Clock,
  IndianRupee
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: number;
  sports: string[];
  amenities: string[];
  distance: string;
  availability: 'available' | 'limited' | 'booked';
}

const SearchResults = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [expandedFilters, setExpandedFilters] = useState({
    sport: true,
    location: false,
    price: false,
    amenities: false,
    rating: false
  });

  const [filters, setFilters] = useState({
    sports: [] as string[],
    priceRange: [0, 5000],
    radius: 10,
    amenities: [] as string[],
    rating: 0
  });

  const venues: Venue[] = [
    {
      id: '1',
      name: 'Elite Sports Arena',
      location: 'Satellite, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.8,
      reviewCount: 124,
      price: 1200,
      sports: ['Badminton', 'Tennis', 'Swimming'],
      amenities: ['Parking', 'WiFi', 'Cafe', 'Shower'],
      distance: '2.3 km',
      availability: 'available'
    },
    {
      id: '2',
      name: 'Champions Club',
      location: 'Bopal, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.7,
      reviewCount: 95,
      price: 800,
      sports: ['Tennis', 'Swimming', 'Gym'],
      amenities: ['Parking', 'Cafe', 'Shower', 'AC'],
      distance: '3.1 km',
      availability: 'limited'
    },
    {
      id: '3',
      name: 'Metro Sports Complex',
      location: 'Makarba, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.6,
      reviewCount: 156,
      price: 600,
      sports: ['Football', 'Basketball', 'Badminton'],
      amenities: ['Parking', 'Shower', 'Changing Room'],
      distance: '1.8 km',
      availability: 'available'
    },
    {
      id: '4',
      name: 'AquaZone Pool Club',
      location: 'Prahlad Nagar, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.4,
      reviewCount: 89,
      price: 1500,
      sports: ['Swimming', 'Water Sports'],
      amenities: ['Parking', 'Cafe', 'Shower', 'Locker'],
      distance: '4.2 km',
      availability: 'available'
    },
    {
      id: '5',
      name: 'Victory Sports Hub',
      location: 'Ghatlodia, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/6253559/pexels-photo-6253559.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.7,
      reviewCount: 78,
      price: 900,
      sports: ['Badminton', 'Table Tennis', 'Squash'],
      amenities: ['Parking', 'AC', 'Shower'],
      distance: '5.1 km',
      availability: 'limited'
    },
    {
      id: '6',
      name: 'PowerPlay Fitness',
      location: 'SG Highway, Ahmedabad',
      images: [
        'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.6,
      reviewCount: 143,
      price: 700,
      sports: ['Gym', 'Basketball', 'Fitness'],
      amenities: ['Parking', 'Shower', 'Equipment'],
      distance: '3.7 km',
      availability: 'available'
    }
  ];

  const toggleFilter = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Parking': <Car className="w-4 h-4" />,
      'WiFi': <Wifi className="w-4 h-4" />,
      'Cafe': <Coffee className="w-4 h-4" />,
      'Shower': '🚿',
      'AC': '❄️',
      'Gym': <Dumbbell className="w-4 h-4" />,
      'Swimming': <Waves className="w-4 h-4" />,
      'Locker': '🔒',
      'Equipment': '🏋️',
      'Changing Room': '👕'
    };
    return iconMap[amenity] || '•';
  };

  const VenueCard = ({ venue }: { venue: Venue }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={venue.images[currentImageIndex]}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Image Navigation Dots */}
          {venue.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {venue.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Heart Icon */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-600'}`} />
          </button>

          {/* Availability Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              venue.availability === 'available' 
                ? 'bg-green-100 text-green-800'
                : venue.availability === 'limited'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {venue.availability === 'available' ? 'Available' : 
               venue.availability === 'limited' ? 'Limited' : 'Booked'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{venue.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
              <span className="text-sm text-gray-500">({venue.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 text-sm">{venue.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">{venue.distance}</span>
          </div>

          {/* Sports */}
          <div className="flex flex-wrap gap-1 mb-3">
            {venue.sports.slice(0, 3).map((sport, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {sport}
              </span>
            ))}
            {venue.sports.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{venue.sports.length - 3} more
              </span>
            )}
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-3 mb-4">
            {venue.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center space-x-1 text-gray-600">
                {getAmenityIcon(amenity)}
                <span className="text-xs">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Price and Book Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-4 h-4 text-gray-900" />
              <span className="text-lg font-bold text-gray-900">{venue.price}</span>
              <span className="text-gray-600 text-sm">/ hour</span>
            </div>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {venues.length} venues found
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80 w-full lg:static fixed inset-0 lg:inset-auto z-50 lg:z-auto`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-32 h-fit lg:h-auto max-h-screen overflow-y-auto">
              {/* Mobile Filter Header */}
              <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="hidden lg:block text-lg font-semibold mb-6">Filters</h2>

                {/* Sport Type Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFilter('sport')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">Sport Type</h3>
                    {expandedFilters.sport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedFilters.sport && (
                    <div className="mt-3 space-y-2">
                      {['Badminton', 'Tennis', 'Football', 'Basketball', 'Swimming', 'Gym'].map((sport) => (
                        <label key={sport} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{sport}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFilter('price')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">Price Range</h3>
                    {expandedFilters.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedFilters.price && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map((range) => (
                          <label key={range} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="priceRange"
                              className="text-rose-500 focus:ring-rose-500"
                            />
                            <span className="text-sm text-gray-700">{range}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Radius Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFilter('location')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">Distance</h3>
                    {expandedFilters.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedFilters.location && (
                    <div className="mt-3 space-y-2">
                      {['Within 2 km', 'Within 5 km', 'Within 10 km', 'Within 20 km'].map((distance) => (
                        <label key={distance} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="distance"
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{distance}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFilter('amenities')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">Amenities</h3>
                    {expandedFilters.amenities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedFilters.amenities && (
                    <div className="mt-3 space-y-2">
                      {['Parking', 'WiFi', 'Cafe', 'Shower', 'AC', 'Locker'].map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFilter('rating')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">Rating</h3>
                    {expandedFilters.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedFilters.rating && (
                    <div className="mt-3 space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label key={rating} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="rating"
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-700">{rating}+ stars</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                <button className="w-full py-2 text-rose-500 hover:text-rose-600 font-medium text-sm border border-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {venues.map((venue) => (
                  <div key={venue.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-6">
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{venue.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">{venue.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 text-sm">{venue.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {venue.sports.map((sport, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {sport}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="w-4 h-4 text-gray-900" />
                            <span className="text-lg font-bold text-gray-900">{venue.price}</span>
                            <span className="text-gray-600 text-sm">/ hour</span>
                          </div>
                          <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
                  <p className="text-gray-600">Interactive map with venue locations will be displayed here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;