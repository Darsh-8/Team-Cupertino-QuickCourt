import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, Wifi, Car, Snowflake, Coffee, Dumbbell, Waves } from 'lucide-react';

interface VenueCardProps {
  image: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
}

const getAmenityIcon = (amenity: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Badminton': '🏸',
    'Tennis': '🎾',
    'Football': '⚽',
    'Basketball': '🏀',
    'Swimming': '🏊',
    'Gym': <Dumbbell className="w-3 h-3" />,
    'Parking': <Car className="w-3 h-3" />,
    'AC Court': <Snowflake className="w-3 h-3" />,
    'Shower': '🚿',
    'Cafe': <Coffee className="w-3 h-3" />,
    'WiFi': <Wifi className="w-3 h-3" />,
    'Premium': '⭐',
    'Multiple Sports': '🏟️',
    'Coaching': '👨‍🏫',
    'Table Tennis': '🏓',
    'Squash': '🎾'
  };
  return iconMap[amenity] || '•';
};

const VenueCard: React.FC<VenueCardProps> = ({
  image,
  name,
  location,
  rating,
  reviewCount,
  amenities
}) => {
  return (
    <Link 
      to={`/venue/1`} 
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-[400px] w-[320px] flex-shrink-0 block"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm">
          <Heart className="w-4 h-4 text-gray-500 hover:text-rose-500 hover:fill-current" />
        </button>
      </div>
      
      <div className="p-5 flex flex-col h-[208px]">
        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight flex-shrink-0">{name}</h3>
        
        <div className="flex items-center space-x-1 mb-3 flex-shrink-0">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 text-sm font-medium">{location}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 flex-shrink-0">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) 
                    ? 'text-rose-500 fill-rose-500' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-900">{rating}</span>
          <span className="text-sm text-gray-500 font-medium">({reviewCount})</span>
        </div>
        
        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {amenities.map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="flex-shrink-0">{getAmenityIcon(amenity)}</span>
              <span>{amenity}</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;