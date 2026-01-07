// src/pages/JobDetailsWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import JobDetails from './JobDetails';

const JobDetailsWrapper = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJob(res.data);
      } catch (err) {
        setError('Failed to load job');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, token, API]);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p>Job not found.</p>;

  return <JobDetails job={job} />;
};

export default JobDetailsWrapper;
