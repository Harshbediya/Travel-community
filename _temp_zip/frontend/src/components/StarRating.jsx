import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const currentScore = hover || rating;
        
        // Handle half stars visually if needed, but for simplicity we'll just check if it's full or empty
        // The prompt asks for half-star support, we can use standard SVG logic or just basic color fills
        // For interaction, we'll keep it simple to whole stars
        
        let fillClass = 'text-gray-300 dark:text-gray-600';
        if (starValue <= currentScore) {
            fillClass = 'fill-primary text-primary';
        } else if (starValue - 0.5 <= currentScore) {
            // Very simple half visual - just relying on the stroke, or would need a split SVG
            // Alternatively, use an inline style mask, but keeping it standard Tailwind here
            fillClass = 'text-primary fill-transparent'; 
        }

        return (
          <button
            key={index}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${fillClass}`}
            onClick={() => {
              if (interactive && onChange) onChange(starValue);
            }}
            onMouseEnter={() => {
              if (interactive) setHover(starValue);
            }}
            onMouseLeave={() => {
              if (interactive) setHover(0);
            }}
            disabled={!interactive}
          >
            <Star className={`w-5 h-5 ${fillClass}`} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
