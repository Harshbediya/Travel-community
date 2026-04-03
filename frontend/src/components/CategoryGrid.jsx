import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Mountain, Building, Compass, Landmark, Crown } from 'lucide-react';

const CategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'BEACH', label: 'Beach', icon: Waves, bgClass: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
    { id: 'MOUNTAIN', label: 'Mountain', icon: Mountain, bgClass: 'bg-gradient-to-br from-green-400 to-teal-500' },
    { id: 'CITY', label: 'City', icon: Building, bgClass: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'ADVENTURE', label: 'Adventure', icon: Compass, bgClass: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { id: 'CULTURAL', label: 'Cultural', icon: Landmark, bgClass: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
    { id: 'LUXURY', label: 'Luxury', icon: Crown, bgClass: 'bg-gradient-to-br from-pink-400 to-rose-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => navigate(`/destinations?category=${category.id}`)}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ${category.bgClass} text-white group`}
        >
          <category.icon className="w-12 h-12 mb-3 stroke-[1.5] group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg tracking-wide">{category.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
