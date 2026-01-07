// pages/CreateJob.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useSelector((state) => state.auth);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/jobs`,
        {
          title,
          description,
          skills: skills.split(",").map((s) => s.trim()),
          location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Job created successfully!");
      setTitle("");
      setDescription("");
      setSkills("");
      setLocation("");
    } catch (err) {
      console.error("Error creating job:", err);
      alert("❌ Failed to create job.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📝 Create a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Required Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
