import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPosts, toggleLike } from '../store/communitySlice';
import CommunityPostCard from '../components/CommunityPostCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { PenSquare } from 'lucide-react';

const Community = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, isLoading, pagination } = useSelector((state) => state.community);
  const activeTab = searchParams.get('category') || 'All';

  useEffect(() => {
    const params = {};
    if (activeTab !== 'All') {
      params.category = activeTab.toLowerCase();
    }
    dispatch(fetchPosts(params));
  }, [dispatch, activeTab]);

  const handleLike = (id) => {
    dispatch(toggleLike(id));
  };

  const handleTabChange = (tab) => {
    if (tab === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: tab.toLowerCase() });
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-navy dark:text-white mb-2">Traveler Stories</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover experiences, tips, and photos from the tribe.</p>
        </div>
        <Link 
          to="/community/new" 
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-pill font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <PenSquare className="w-5 h-5" />
          Share Your Journey
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[70%]">
          <div className="flex gap-4 border-b dark:border-gray-800 pb-2 mb-8 overflow-x-auto hide-scrollbar">
            {['All', 'Photos', 'Stories', 'Tips', 'Reviews'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500 hover:text-navy dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <LoadingSkeleton variant="post" count={4} />
            ) : Array.isArray(posts) ? (
              posts.map(post => (
                <CommunityPostCard key={post.id} post={post} onLikeToggle={handleLike} />
              ))
            ) : null}
          </div>
          
          {pagination && pagination.next && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-pill font-medium transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block w-[30%] space-y-8">
          <div className="bg-white dark:bg-navy-light rounded-card p-6 border dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-navy dark:text-white">Top Contributors</h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/100?img=${i+1}`} className="w-10 h-10 rounded-full" alt="user" />
                    <div>
                      <p className="font-bold text-sm dark:text-white">Traveler_{i+1}</p>
                      <p className="text-xs text-gray-500">{20 - i} posts</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary hover:text-primary-dark">Follow</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy-light rounded-card p-6 border dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-navy dark:text-white">Trending Destinations</h3>
            <div className="space-y-4">
              {['Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'Rome, Italy'].map((dest, i) => (
                <div key={i} className="group cursor-pointer">
                  <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{dest}</h4>
                  <p className="text-xs text-gray-500">{100 - (i*10)} active discussions</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
