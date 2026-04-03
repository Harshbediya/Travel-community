import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { destinationImages } from '../assets';

const DestinationCard = ({ destination, showSaveButton = true, onSaveToggle }) => {
  const { slug, name, city, country, category, featured_image, avg_rating, total_reviews, is_saved } = destination;

  // Placeholder mapping to flag emojis based on simple check if it's a known country or just generic globe
  const getFlag = (country) => {
    return '🇮🇳'; // India flag for demo
  };

  const getCategoryColor = (cat) => {
    const colors = {
      beach: 'bg-blue-500 text-white',
      mountain: 'bg-green-600 text-white',
      city: 'bg-purple-500 text-white',
      adventure: 'bg-orange-500 text-white',
      cultural: 'bg-yellow-500 text-white',
      luxury: 'bg-pink-500 text-white'
    };
    return colors[cat?.toLowerCase()] || 'bg-gray-500 text-white';
  };

  const getImageUrl = (image, destinationName) => {
    // Check if we have local images for this destination
    if (destinationImages[destinationName]) {
      return destinationImages[destinationName][0]; // Default to first local image
    }
    
    if (!image) return 'https://placehold.co/600x400?text=No+Image';
    if (image.startsWith('http')) return image;
    return `https://res.cloudinary.com/dvz3i2jri/${image}`;
  };

  return (
    <div className="group bg-white dark:bg-navy-light rounded-card shadow-sm hover:shadow-hover hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative border dark:border-gray-800">
      <Link to={`/destinations/${slug}`} className="block overflow-hidden aspect-video relative">
        <img 
          src={getImageUrl(featured_image, name)} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Unavailable'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      
      <div className={`absolute top-4 left-4 ${getCategoryColor(category)} px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm bg-opacity-90`}>
        {category}
      </div>

      {showSaveButton && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSaveToggle) onSaveToggle(slug);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors shadow-sm"
        >
          <Heart className={`w-5 h-5 ${is_saved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      )}

      <div className="p-5">
        <Link to={`/destinations/${slug}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading font-bold text-xl text-navy dark:text-white line-clamp-1">{name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <span>{getFlag(country)}</span> {city}, {country}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm dark:text-yellow-400">{avg_rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{total_reviews}</span> reviews
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
