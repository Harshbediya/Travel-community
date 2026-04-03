import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MapPin, User as UserIcon } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

const CommunityPostCard = ({ post, onLikeToggle }) => {
  const { id, author, title, excerpt, body, image, destination_name, likes_count, comments_count, is_liked, created_at } = post;

  return (
    <div className="bg-white dark:bg-navy-light rounded-card shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      {/* Author Row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {author.avatar ? (
            <img 
              src={author.avatar} 
              alt={author.username} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy dark:text-white">
              <Link to={`/profile/${author.username}`} className="hover:text-primary transition-colors">
                @{author.username}
              </Link>
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 mt-0.5">
              <span>{timeAgo(created_at)}</span>
            </div>
          </div>
        </div>
        
        {post.category && (
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-wider">
            {post.category}
          </span>
        )}
      </div>

      {/* Image (if exists) */}
      {image && (
        <Link to={`/community/post/${id}`}>
          <img 
            src={image.startsWith('http') ? image : `https://res.cloudinary.com/dvz3i2jri/${image}`} 
            alt={title} 
            className="w-full h-auto max-h-72 object-cover border-y dark:border-gray-700 hover:opacity-95 transition-opacity"
            onError={(e) => e.target.style.display = 'none'}
          />
        </Link>
      )}

      {/* Content */}
      <div className="px-4 pb-4">
        {destination_name && (
          <div className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3" />
            {destination_name}
          </div>
        )}
        <Link to={`/community/post/${id}`}>
          <h3 className="font-bold text-lg text-navy dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {excerpt || body}
          </p>
        </Link>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t dark:border-gray-700 flex items-center justify-between text-gray-500 dark:text-gray-400">
        <button 
          onClick={() => onLikeToggle && onLikeToggle(id)}
          className="flex items-center gap-1.5 hover:text-red-500 transition-colors group"
        >
          <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${is_liked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-sm font-medium">{likes_count}</span>
        </button>
        
        <Link to={`/community/post/${id}#comments`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{comments_count}</span>
        </Link>
        
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CommunityPostCard;
