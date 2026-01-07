import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../features/job/jobSlice';
import ApplyButton from '../components/ApplyButton';
import CreateJobForm from '../components/CreateJobForm';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector(state => state.job);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚀 Job Board</h2>

      {/* Job Posting Form */}
      <CreateJobForm />

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} className="border p-4 rounded mb-4">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p>{job.description}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
            <ApplyButton jobId={job._id} applied={job.applied} />
          </div>
        ))
      )}
    </div>
  );
};

export default Jobs;
