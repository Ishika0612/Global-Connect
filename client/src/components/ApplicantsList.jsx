import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div key={applicant._id} className="applicant-card">
          <p>Name: {applicant.name}</p>
          <p>Email: {applicant.email}</p>
          <p>Phone: {applicant.phone}</p>
          <button onClick={() => window.open(`tel:${applicant.phone}`)}>Call</button>
          <button onClick={() => respondApplicant(applicant._id, 'accept')}>Accept</button>
          <button onClick={() => respondApplicant(applicant._id, 'reject')}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default ApplicantsList;
