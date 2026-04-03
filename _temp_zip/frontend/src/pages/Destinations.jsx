import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X } from 'lucide-react';
import { fetchDestinations, toggleSave } from '../store/destinationsSlice';
import DestinationCard from '../components/DestinationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CATEGORIES = ['BEACH', 'MOUNTAIN', 'CITY', 'ADVENTURE', 'CULTURAL', 'LUXURY'];

const Destinations = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { destinations, isLoading, pagination } = useSelector((state) => state.destinations);
  const { token } = useSelector((state) => state.auth);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_rating: searchParams.get('min_rating') || '',
    ordering: searchParams.get('ordering') || '',
    search: searchParams.get('search') || '',
  });

  const loadDestinations = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    dispatch(fetchDestinations(activeFilters));
  };

  useEffect(() => {
    loadDestinations();
  }, [searchParams]);

  // Update search params when filters change (Debounced for text/number inputs)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setSearchParams(filters);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const empty = { category: '', min_price: '', max_price: '', min_rating: '', ordering: '', search: '' };
    setFilters(empty);
    setSearchParams(empty);
    setMobileFiltersOpen(false);
  };

  const handleSaveToggle = (slug) => {
    if (token) {
      dispatch(toggleSave(slug));
    } else {
      // Redirect to login or show modal
      alert("Please login to save destinations");
    }
  };

  const getPageNumber = (url) => {
    if (!url) return null;
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('page') ? `page=${urlParams.get('page')}` : '';
  };

  const renderFilters = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="font-bold mb-3 dark:text-white">Category</h4>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm dark:text-gray-300">
              <input 
                type="radio" 
                name="category" 
                value={cat} 
                checked={filters.category === cat}
                onChange={handleFilterChange}
                className="text-primary focus:ring-primary"
              />
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold mb-3 dark:text-white">Price Range</h4>
        <div className="flex gap-2">
          <input 
            type="number" 
            name="min_price" 
            placeholder="Min" 
            value={filters.min_price}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy dark:border-gray-700 dark:text-white"
          />
          <input 
            type="number" 
            name="max_price" 
            placeholder="Max" 
            value={filters.max_price}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <h4 className="font-bold mb-3 dark:text-white">Min Rating</h4>
        <select 
          name="min_rating" 
          value={filters.min_rating} 
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded dark:bg-navy dark:border-gray-700 dark:text-white"
        >
          <option value="">Any</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div>
        <h4 className="font-bold mb-3 dark:text-white">Sort By</h4>
        <select 
          name="ordering" 
          value={filters.ordering} 
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded dark:bg-navy dark:border-gray-700 dark:text-white"
        >
          <option value="">Default</option>
          <option value="price_per_night">Price: Low to High</option>
          <option value="-price_per_night">Price: High to Low</option>
          <option value="-avg_rating">Highest Rated</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 mt-4 lg:hidden">
        <button onClick={() => setMobileFiltersOpen(false)} className="bg-primary text-white py-2 rounded-lg font-medium">Apply Filters</button>
        <button onClick={clearFilters} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 py-2 font-medium">Clear All</button>
      </div>
      <div className="hidden lg:flex flex-col gap-2 mt-4">
        <button onClick={clearFilters} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 py-2 font-medium">Clear All Filters</button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold dark:text-white">Explore Destinations</h1>
        <button 
          className="lg:hidden flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-1/4 bg-white dark:bg-navy-light p-6 rounded-card border dark:border-gray-800 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Filter className="w-5 h-5 text-primary" /> Filters
          </h3>
          {renderFilters()}
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-navy-dark p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-6 h-6 dark:text-white" /></button>
            </div>
            {renderFilters()}
          </div>
        )}

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            {pagination ? `Showing results` : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <LoadingSkeleton variant="card" count={6} />
            ) : destinations.length > 0 ? (
              destinations.map(dest => (
                <DestinationCard 
                  key={dest.id} 
                  destination={dest} 
                  onSaveToggle={handleSaveToggle} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                <img src="https://placehold.co/300x200?text=No+Results" alt="No results" className="mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">No destinations found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary-light/10">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && (pagination.next || pagination.previous) && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                disabled={!pagination.previous}
                onClick={() => loadDestinations(getPageNumber(pagination.previous))}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-white"
              >
                Previous
              </button>
              <button 
                disabled={!pagination.next}
                onClick={() => loadDestinations(getPageNumber(pagination.next))}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
