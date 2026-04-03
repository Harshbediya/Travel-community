import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createPost } from '../store/communitySlice';
import Toast from '../components/Toast';
import { UploadCloud, X, MapPin, Tag } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [destination, setDestination] = useState('');
  
  // Minimal destination search handling for real app
  const [destinationsList, setDestinationsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch destinations for select
    const fetchDest = async () => {
      try {
        const res = await axiosInstance.get('/api/destinations/');
        setDestinationsList(res.data.results || res.data);
      } catch(err) {}
    };
    fetchDest();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return Toast.error("Image must be less than 5MB");
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) return Toast.error("Please enter a title");
    if (body.length < 50) return Toast.error("Story must be at least 50 characters long");
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('category', category);
      if (image) formData.append('image', image);
      if (destination) formData.append('destination', destination);

      const newPost = await dispatch(createPost(formData)).unwrap();
      Toast.success("Story published successfully!");
      navigate(`/community/post/${newPost.id}`);
    } catch (err) {
      Toast.error("Failed to publish story.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto min-h-screen">
      <div className="bg-white dark:bg-navy-light rounded-card shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
          <h1 className="text-3xl font-heading font-bold mb-2">Share Your Journey</h1>
          <p className="opacity-90">Inspire the WanderTribe community with your travel experiences, tips, and phenomenal photos.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-6 flex flex-col">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Story Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your experience a catchy title..."
                className="w-full bg-gray-50 dark:bg-navy border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white font-medium text-lg placeholder:text-gray-400"
                maxLength={200}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Destination (Optional)
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-navy border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white appearance-none"
                >
                  <option value="">Select a location</option>
                  {destinationsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-navy border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white appearance-none"
                >
                  <option value="general">General</option>
                  <option value="photos">Photos</option>
                  <option value="stories">Stories</option>
                  <option value="tips">Tips</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">The Full Story</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell us what happened... (minimum 50 characters)"
                rows="8"
                className="w-full bg-gray-50 dark:bg-navy border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none leading-relaxed"
              ></textarea>
              <div className="flex justify-end mt-2">
                <span className={`text-xs font-medium ${body.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
                  {body.length} / 50 min characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Add a Photo (Optional)</label>
              
              {!previewUrl ? (
                <div 
                  className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-navy hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-primary transition-colors mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Click to upload an image</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-transform hover:scale-110 flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/community')}
              className="px-6 py-3 font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-pill shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 min-w-[160px] flex justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Publish Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
