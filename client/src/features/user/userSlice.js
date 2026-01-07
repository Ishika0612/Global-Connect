import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const fetchUser = createAsyncThunk('user/fetchUser', async (id) => {
  const res = await axios.get(`${API}/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, data }) => {
  const res = await axios.put(`${API}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, state => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  }
});

export default userSlice.reducer;
