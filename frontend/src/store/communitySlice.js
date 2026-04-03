import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchPosts = createAsyncThunk('community/fetchPosts', async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(`/api/posts/${query ? '?' + query : ''}`);
  return response.data;
});

export const fetchPostById = createAsyncThunk('community/fetchById', async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}/`);
  return response.data;
});

export const createPost = createAsyncThunk('community/createPost', async (formData) => {
  const response = await axiosInstance.post('/api/posts/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
});

export const deletePost = createAsyncThunk('community/deletePost', async (id) => {
  await axiosInstance.delete(`/api/posts/${id}/`);
  return id;
});

export const toggleLike = createAsyncThunk('community/toggleLike', async (id) => {
  const response = await axiosInstance.post(`/api/posts/${id}/like/`);
  return { id, ...response.data };
});

export const fetchComments = createAsyncThunk('community/fetchComments', async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}/comments/`);
  return { id, comments: response.data };
});

export const addComment = createAsyncThunk('community/addComment', async ({ id, body }) => {
  const response = await axiosInstance.post(`/api/posts/${id}/comments/`, { body });
  return { id, comment: response.data };
});

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    posts: [],
    current: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.results || action.payload;
        state.pagination = action.payload.count ? { count: action.payload.count, next: action.payload.next, previous: action.payload.previous } : null;
      })
      .addCase(fetchPosts.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(fetchPostById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPostById.fulfilled, (state, action) => { state.isLoading = false; state.current = action.payload; })
      
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.id);
        if (post) {
            post.is_liked = action.payload.liked;
            post.likes_count = action.payload.count;
        }
        if (state.current && state.current.id === action.payload.id) {
            state.current.is_liked = action.payload.liked;
            state.current.likes_count = action.payload.count;
        }
      })
      
      .addCase(fetchComments.fulfilled, (state, action) => {
        if (state.current && state.current.id === action.payload.id) {
          state.current.comments = action.payload.comments.results || action.payload.comments;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.current && state.current.id === action.payload.id) {
          if (!state.current.comments) state.current.comments = [];
          state.current.comments.push(action.payload.comment);
        }
      })
      
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      });
  }
});

export default communitySlice.reducer;
