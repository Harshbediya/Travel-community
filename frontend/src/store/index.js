import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import destinationsReducer from './destinationsSlice';
import communityReducer from './communitySlice';
import bookingsReducer from './bookingsSlice';
import hotelsReducer from './hotelsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationsReducer,
    community: communityReducer,
    bookings: bookingsReducer,
    hotels: hotelsReducer,
  },
});

export default store;
