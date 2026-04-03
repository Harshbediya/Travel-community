import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchUserBookings = createAsyncThunk('bookings/fetchUserBookings', async () => {
  const response = await axiosInstance.get('/api/bookings/hotels/');
  return response.data.results || response.data;
});

export const fetchTripBookings = createAsyncThunk('bookings/fetchTripBookings', async () => {
  const response = await axiosInstance.get('/api/bookings/trips/');
  return response.data.results || response.data;
});

export const createHotelBooking = createAsyncThunk('bookings/createHotelBooking', async (data) => {
  const response = await axiosInstance.post('/api/bookings/hotels/', data);
  return response.data;
});

export const createTripBooking = createAsyncThunk('bookings/createTripBooking', async (data) => {
  const response = await axiosInstance.post('/api/bookings/trips/', data);
  return response.data;
});

export const cancelBooking = createAsyncThunk('bookings/cancelBooking', async (id) => {
  await axiosInstance.delete(`/api/bookings/hotels/${id}/`);
  return { id, status: 'cancelled' };
});

export const fetchUnifiedBookings = createAsyncThunk('bookings/fetchUnifiedBookings', async () => {
  const response = await axiosInstance.get('/api/bookings/unified/');
  return response.data.results || response.data;
});

export const createUnifiedBooking = createAsyncThunk('bookings/createUnifiedBooking', async (data) => {
  const response = await axiosInstance.post('/api/bookings/unified/', data);
  return response.data;
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    hotelBookings: [],
    tripBookings: [],
    unifiedBookings: [],
    currentBooking: JSON.parse(localStorage.getItem('partialBooking')) || {
      destination: null,
      hotel: null,
      startDate: null,
      endDate: null,
      travelers: 1,
      transport: null,
      addOns: [],
      travelersInfo: [],
      totalPrice: 0,
    },
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    updatePartialBooking: (state, action) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
      localStorage.setItem('partialBooking', JSON.stringify(state.currentBooking));
    },
    clearPartialBooking: (state) => {
      state.currentBooking = {
        destination: null,
        hotel: null,
        startDate: null,
        endDate: null,
        travelers: 1,
        transport: null,
        addOns: [],
        travelersInfo: [],
        totalPrice: 0,
      };
      localStorage.removeItem('partialBooking');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUserBookings.fulfilled, (state, action) => { state.isLoading = false; state.hotelBookings = action.payload; })
      .addCase(fetchUserBookings.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(fetchTripBookings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTripBookings.fulfilled, (state, action) => { state.isLoading = false; state.tripBookings = action.payload; })
      
      .addCase(fetchUnifiedBookings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUnifiedBookings.fulfilled, (state, action) => { state.isLoading = false; state.unifiedBookings = action.payload; })

      .addCase(createUnifiedBooking.pending, (state) => { state.isLoading = true; state.success = false; })
      .addCase(createUnifiedBooking.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.success = true;
        state.unifiedBookings.unshift(action.payload);
      })
      .addCase(createUnifiedBooking.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(createHotelBooking.pending, (state) => { state.isLoading = true; state.success = false; })
      .addCase(createHotelBooking.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.success = true;
        state.hotelBookings.unshift(action.payload);
      })
      .addCase(createHotelBooking.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(createTripBooking.pending, (state) => { state.isLoading = true; state.success = false; })
      .addCase(createTripBooking.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.success = true;
        state.tripBookings.unshift(action.payload);
      })
      .addCase(createTripBooking.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const hBooking = state.hotelBookings.find(b => b.id === action.payload.id);
        if (hBooking) hBooking.status = 'cancelled';
        const tBooking = state.tripBookings.find(b => b.id === action.payload.id);
        if (tBooking) tBooking.status = 'cancelled';
      });
  }
});

export const { resetStatus, updatePartialBooking, clearPartialBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
