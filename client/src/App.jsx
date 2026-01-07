import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Jobs from './pages/Jobs';
import Admin from './pages/Admin';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Notification from './pages/Notification';

// Minimal ApplicantsList component inside this file (or you can move to components folder)
const ApplicantsList = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/jobs/${jobId}/applicants`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setApplicants(res.data))
    .catch(console.error);
  }, [jobId]);

  const respondApplicant = (applicantId, action) => {
    axios.post(`${API}/jobs/${jobId}/respond`, { applicantId, action }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert(`Applicant ${action}ed.`);
      setApplicants(applicants.filter(a => a._id !== applicantId));
    })
    .catch(console.error);
  };

  return (
    <div>
      <h3>Applicants</h3>
      {applicants.length === 0 && <p>No applicants yet.</p>}
      {applicants.map(applicant => (
        <div key={applicant._id} className="applicant-card border p-2 my-2 rounded">
          <p>Name: {applicant.name}</p>
          <p>Email: {applicant.email}</p>
          <p>Phone: {applicant.phone}</p>
          <button onClick={() => window.open(`tel:${applicant.phone}`)} className="mr-2 bg-blue-500 text-white px-2 rounded">Call</button>
          <button onClick={() => respondApplicant(applicant._id, 'accept')} className="mr-2 bg-green-500 text-white px-2 rounded">Accept</button>
          <button onClick={() => respondApplicant(applicant._id, 'reject')} className="bg-red-500 text-white px-2 rounded">Reject</button>
        </div>
      ))}
    </div>
  );
};

// JobDetails component inside this file too:
const JobDetails = ({ job }) => {
  const currentUserId = localStorage.getItem('userId');

  if (!job) return <p>Job not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="mb-4">{job.description}</p>
      <p className="text-sm text-gray-500 mb-4">Location: {job.location}</p>

      {/* Show applicants only if current user is the job creator */}
      {job.postedBy._id === currentUserId && (
        <ApplicantsList jobId={job._id} />
      )}
    </div>
  );
};

// JobDetailsWrapper to fetch job data by ID
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

  return <JobDetails job={job} />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/jobs" element={<Jobs />} />

      {/* Job details route */}
      <Route path="/jobs/:jobId" element={<JobDetailsWrapper />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="*" element={<div className="p-6 text-red-500 text-xl">404: Page Not Found</div>} />
    </Routes>
  );
};

export default App;
