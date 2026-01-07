import { useDispatch } from 'react-redux';
import { applyToJob } from '../features/job/jobSlice';

const ApplyButton = ({ jobId, applied }) => {
  const dispatch = useDispatch();

  const handleApply = () => {
    dispatch(applyToJob(jobId))
      .unwrap()
      .then(() => alert("Application submitted!"))
      .catch(err => alert(err?.response?.data?.error || "Failed to apply"));
  };

  return (
    <button
      onClick={handleApply}
      disabled={applied}
      className={`px-4 py-1 rounded mt-2 ${applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
    >
      {applied ? 'Applied' : 'Apply'}
    </button>
  );
};

export default ApplyButton;
