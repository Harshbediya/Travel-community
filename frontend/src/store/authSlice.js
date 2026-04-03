import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

const userStr = localStorage.getItem('user');
const access_token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');

const initialState = {
  user: userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null,
  token: access_token || null,
  refresh: refresh_token || null,
  isLoading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login/`, credentials);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register/`, userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/auth/me/');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, tokens } = action.payload;
      state.user = user;
      state.token = tokens.access;
      state.refresh = tokens.refresh;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refresh = null;
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('access_token', action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        authSlice.caseReducers.login(state, action);
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        authSlice.caseReducers.login(state, action);
      })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { login, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
