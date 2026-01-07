import axios from 'axios';
import { useSelector } from 'react-redux';

const ApplyButton = ({ jobId }) => {
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');

  const handleApply = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/apply/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Application submitted!");
    } catch (error) {
      console.error("Apply error:", error);
    }
  };

  return (
    <button
      onClick={handleApply}
      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mt-2"
    >
      Apply
    </button>
  );
};

export default ApplyButton;
