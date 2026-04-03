import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Users, SquareStack, LogOut, User as UserIcon } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';
import CommunityPostCard from '../components/CommunityPostCard';
import DestinationCard from '../components/DestinationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Profile = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'posts';
  
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/users/${username}/`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (!profile) return;
    
    const fetchContent = async () => {
      setContentLoading(true);
      try {
        if (tab === 'posts') {
          const res = await axiosInstance.get(`/api/posts/?username=${username}`);
          setContent(res.data.results || res.data);
        } else if (tab === 'saved' && isOwnProfile) {
          const res = await axiosInstance.get('/api/users/saved-destinations/');
          setContent(res.data);
        } else if (tab === 'bookings' && isOwnProfile) {
          const res = await axiosInstance.get('/api/bookings/trips/');
          setContent(res.data.results || res.data);
        } else if (tab === 'reviews') {
          // Minimal mock or fetch if api supports user filtering
          setContent([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setContentLoading(false);
      }
    };
    
    fetchContent();
  }, [tab, profile, isOwnProfile]);

  const handleFollowToggle = async () => {
    try {
      const res = await axiosInstance.post(`/api/users/${username}/follow/`);
      setProfile(prev => ({ 
        ...prev, 
        is_following: res.data.is_following, 
        followers_count: res.data.followers_count 
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const setTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  if (loading) return <div className="pt-24 px-4 min-h-screen"><LoadingSkeleton variant="profile" /></div>;
  if (!profile) return <div className="pt-32 text-center text-2xl font-bold dark:text-white">User not found</div>;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-surface dark:bg-navy transition-colors">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary-light to-primary-dark relative">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Profile Header */}
        <div className="bg-white dark:bg-navy-light rounded-card shadow-md p-6 sm:p-8 -mt-16 relative border dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-20 sm:-mt-24 mb-6">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.username} 
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-navy-light object-cover bg-white shadow-md z-10" 
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-navy-light bg-gray-100 flex items-center justify-center text-gray-400 shadow-md z-10">
                <UserIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
            )}
            
            <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row justify-between w-full items-center sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-navy dark:text-white">{profile.full_name || profile.username}</h1>
                <p className="text-gray-500 font-medium">@{profile.username}</p>
              </div>
              
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <button className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-pill transition-colors">
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={handleFollowToggle}
                    className={`px-8 py-2 font-bold rounded-pill transition-all ${profile.is_following ? 'bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-500 hover:border-red-500 border border-transparent' : 'bg-primary text-white hover:bg-primary-dark shadow-md'}`}
                  >
                    {profile.is_following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-center sm:text-left text-lg">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-6 pt-6 border-t dark:border-gray-800">
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                  <MapPin className="w-5 h-5 text-primary" /> {profile.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                <Calendar className="w-5 h-5 text-primary" /> Joined {timeAgo(profile.date_joined)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center sm:justify-start gap-8 bg-gray-50 dark:bg-navy rounded-2xl p-6">
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <span className="block text-2xl font-bold text-navy dark:text-white">{profile.posts_count}</span>
              <span className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Posts</span>
            </div>
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <span className="block text-2xl font-bold text-navy dark:text-white">{profile.followers_count}</span>
              <span className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Followers</span>
            </div>
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <span className="block text-2xl font-bold text-navy dark:text-white">{profile.following_count}</span>
              <span className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Following</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-6 mt-8 mb-6 overflow-x-auto hide-scrollbar border-b dark:border-gray-800 pb-px">
          <button 
            onClick={() => setTab('posts')} 
            className={`px-4 py-3 font-semibold whitespace-nowrap uppercase tracking-wider text-sm transition-colors border-b-2 ${tab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy dark:hover:text-white'}`}
          >
            Posts
          </button>
          
          {isOwnProfile && (
            <>
              <button 
                onClick={() => setTab('bookings')} 
                className={`px-4 py-3 font-semibold whitespace-nowrap uppercase tracking-wider text-sm transition-colors border-b-2 ${tab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy dark:hover:text-white'}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setTab('saved')} 
                className={`px-4 py-3 font-semibold whitespace-nowrap uppercase tracking-wider text-sm transition-colors border-b-2 ${tab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy dark:hover:text-white'}`}
              >
                Saved
              </button>
            </>
          )}
          
          <button 
            onClick={() => setTab('reviews')} 
            className={`px-4 py-3 font-semibold whitespace-nowrap uppercase tracking-wider text-sm transition-colors border-b-2 ${tab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy dark:hover:text-white'}`}
          >
            Reviews
          </button>
        </div>

        {/* Content */}
        <div>
          {contentLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LoadingSkeleton variant="card" count={2} />
             </div>
          ) : content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tab === 'posts' && content.map(post => <CommunityPostCard key={post.id} post={post} />)}
              {tab === 'saved' && content.map(dest => <DestinationCard key={dest.id} destination={dest} />)}
              {tab === 'bookings' && content.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-navy-light rounded-card p-4 shadow-sm border dark:border-gray-800">
                  <h4 className="font-bold">{booking.destination?.name}</h4>
                  <p className="text-sm text-gray-500">{booking.check_in} to {booking.check_out}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-navy-light rounded-card border border-dashed border-gray-300 dark:border-gray-700">
              <SquareStack className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Nothing to see here yet</h3>
              <p className="text-gray-500">This section is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
