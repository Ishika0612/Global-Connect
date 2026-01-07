import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk('auth/loginUser', async (data) => {
  const res = await axios.post(`${API}/auth/login`, data);
  localStorage.setItem('token', res.data.token);
  return res.data.user;
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data) => {
  const res = await axios.post(`${API}/auth/register`, data);
  localStorage.setItem('token', res.data.token);
  return res.data.user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
