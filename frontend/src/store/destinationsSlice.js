import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchFeatured = createAsyncThunk('destinations/fetchFeatured', async () => {
  const response = await axiosInstance.get('/api/destinations/featured/');
  return response.data;
});

export const fetchDestinations = createAsyncThunk('destinations/fetchDestinations', async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(`/api/destinations/${query ? '?' + query : ''}`);
  return response.data;
});

export const fetchDestinationBySlug = createAsyncThunk('destinations/fetchBySlug', async (slug) => {
  const response = await axiosInstance.get(`/api/destinations/${slug}/`);
  return response.data;
});

export const toggleSave = createAsyncThunk('destinations/toggleSave', async (slug) => {
  const response = await axiosInstance.post(`/api/destinations/${slug}/save/`);
  return { slug, ...response.data };
});

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: {
    destinations: [],
    featured: [],
    current: null,
    filters: {},
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchDestinations.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.destinations = action.payload.results || action.payload;
        state.pagination = action.payload.count ? { count: action.payload.count, next: action.payload.next, previous: action.payload.previous } : null;
      })
      .addCase(fetchDestinations.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(fetchDestinationBySlug.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDestinationBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      
      .addCase(toggleSave.fulfilled, (state, action) => {
        if (state.current && state.current.slug === action.payload.slug) {
          state.current.is_saved = action.payload.is_saved;
        }
      });
  }
});

export const { setFilters, clearFilters } = destinationsSlice.actions;
export default destinationsSlice.reducer;
