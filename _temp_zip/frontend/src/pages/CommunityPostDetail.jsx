import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, fetchComments, addComment, toggleLike } from '../store/communitySlice';
import { Heart, MessageCircle, Share2, MapPin, Send } from 'lucide-react';
import Toast from '../components/Toast';
import { timeAgo } from '../utils/timeAgo';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CommunityPostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: post, isLoading } = useSelector((state) => state.community);
  const { token } = useSelector((state) => state.auth);
  
  const [commentBody, setCommentBody] = useState('');

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  const handleLike = () => {
    if (!token) return Toast.info("Please login to like posts");
    dispatch(toggleLike(id));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Toast.success("Link copied to clipboard!");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) return Toast.info("Please login to comment");
    if (!commentBody.trim()) return;
    
    try {
      await dispatch(addComment({ id, body: commentBody })).unwrap();
      setCommentBody('');
      Toast.success("Comment added!");
    } catch (err) {
      Toast.error("Failed to add comment");
    }
  };

  if (isLoading || !post) return <div className="pt-32 px-4 max-w-4xl mx-auto"><LoadingSkeleton variant="post" /></div>;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="w-full lg:w-[70%]">
        <div className="bg-white dark:bg-navy-light rounded-card shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          {/* Header */}
          <div className="p-6 md:p-8 pb-4">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block bg-primary/10 text-primary uppercase text-xs font-bold px-3 py-1 rounded-pill">
                {post.category || 'General'}
              </span>
              {post.destination_name && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {post.destination_name}
                </div>
              )}
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between pb-6 border-b dark:border-gray-800">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author?.avatar || 'https://placehold.co/100'} 
                  alt={post.author?.username} 
                  className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700" 
                />
                <div>
                  <p className="font-bold text-navy dark:text-white leading-tight">
                    <Link to={`/profile/${post.author?.username}`} className="hover:text-primary transition-colors">
                      {post.author?.full_name || `@${post.author?.username}`}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {timeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          {post.image && (
            <img 
              src={post.image.startsWith('http') ? post.image : `https://res.cloudinary.com/dvz3i2jri/${post.image}`} 
              alt={post.title} 
              className="w-full max-h-[500px] object-cover" 
            />
          )}

          {/* Body */}
          <div className="p-6 md:p-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {post.body}
          </div>

          {/* Actions */}
          <div className="px-6 md:px-8 py-4 border-t dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-navy-dark">
            <button onClick={handleLike} className="flex items-center gap-2 group transition-colors text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500">
              <div className={`p-2 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors ${post.is_liked ? 'text-red-500' : ''}`}>
                <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-red-500' : ''}`} />
              </div>
              <span className="font-bold">{post.likes_count}</span>
            </button>
            
            <a href="#comments" className="flex items-center gap-2 group transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="font-bold">{post.comments?.length || 0}</span>
            </a>
            
            <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments" className="bg-white dark:bg-navy-light rounded-card shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 overflow-hidden">
          <h2 className="text-2xl font-bold font-heading mb-8 dark:text-white">Comments ({post.comments?.length || 0})</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <textarea 
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder={token ? "Share your thoughts..." : "Login to comment"}
              disabled={!token}
              className="w-full bg-gray-50 dark:bg-navy border dark:border-gray-700 dark:text-white rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-primary transition-all resize-none mb-3"
            />
            <button 
              type="submit"
              disabled={!token || !commentBody.trim()}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-6">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4 group">
                  <img 
                    src={comment.author_avatar || 'https://placehold.co/100'} 
                    alt={comment.author_username} 
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0" 
                  />
                  <div className="flex-1 bg-gray-50 dark:bg-navy p-4 rounded-2xl rounded-tl-sm group-hover:bg-gray-100 dark:group-hover:bg-navy-dark transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-navy dark:text-white">
                        <Link to={`/profile/${comment.author_username}`} className="hover:text-primary transition-colors">
                          @{comment.author_username}
                        </Link>
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8 italic bg-gray-50 dark:bg-navy rounded-xl">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Related etc. */}
      <div className="hidden lg:block w-[30%]">
        <div className="sticky top-28 bg-white dark:bg-navy-light rounded-card shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-6 text-navy dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">More from WanderTribe</h3>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://placehold.co/150x150?text=Related+${i+1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                    alt="Related" 
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-sm text-navy dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-1 mb-2">
                    A beautiful memory from a recent trip
                  </h4>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
