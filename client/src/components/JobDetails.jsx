import React from 'react';
import { useSelector } from 'react-redux';
import ApplicantsList from '../components/ApplicantsList';

const JobDetails = ({ job }) => {
  const currentUserId = useSelector(state => state.auth.user?._id);

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>

      {job.postedBy === currentUserId && (
        <ApplicantsList jobId={job._id} />
      )}
    </div>
  );
};

export default JobDetails;
