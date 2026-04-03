import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(`/api/hotels/${query ? '?' + query : ''}`);
  return response.data;
});

export const fetchHotelDetail = createAsyncThunk('hotels/fetchHotelDetail', async (id) => {
  const response = await axiosInstance.get(`/api/hotels/${id}/`);
  return response.data;
});

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState: {
    hotels: [],
    selectedHotel: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchHotels.fulfilled, (state, action) => { state.isLoading = false; state.hotels = action.payload; })
      .addCase(fetchHotels.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(fetchHotelDetail.pending, (state) => { state.isLoading = true; })
      .addCase(fetchHotelDetail.fulfilled, (state, action) => { state.isLoading = false; state.selectedHotel = action.payload; })
      .addCase(fetchHotelDetail.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; });
  }
});

export default hotelsSlice.reducer;
