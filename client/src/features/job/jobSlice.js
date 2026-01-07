import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const fetchJobs = createAsyncThunk('job/fetchJobs', async () => {
  const res = await axios.get(`${API}/jobs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
});

export const createJob = createAsyncThunk('job/createJob', async (jobData) => {
  const res = await axios.post(`${API}/jobs`, jobData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
});

export const applyToJob = createAsyncThunk('job/applyToJob', async (jobId) => {
  await axios.post(`${API}/jobs/apply/${jobId}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return jobId;
});

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload); // add new job to top
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        const job = state.jobs.find(j => j._id === jobId);
        if (job) job.applied = true;
      });
  }
});

export default jobSlice.reducer;
