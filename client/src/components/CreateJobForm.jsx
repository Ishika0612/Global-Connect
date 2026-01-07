import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob } from '../features/job/jobSlice';

const CreateJobForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skills: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const jobData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim())
    };
    dispatch(createJob(jobData))
      .unwrap()
      .then(() => {
        alert("Job posted successfully!");
        setFormData({ title: '', description: '', location: '', skills: '' });
      })
      .catch(err => alert(err?.response?.data?.error || "Failed to post job"));
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 bg-gray-50">
      <h3 className="text-lg font-bold mb-2">📌 Post a Job</h3>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="border w-full p-2 mb-2"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="border w-full p-2 mb-2"
        required
      />
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="border w-full p-2 mb-2"
        required
      />
      <input
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills (comma-separated)"
        className="border w-full p-2 mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post Job
      </button>
    </form>
  );
};

export default CreateJobForm;
