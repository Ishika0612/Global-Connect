import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPosts } from '../features/post/postSlice';

const CreatePost = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !file) {
      return alert('Please write something or select an image.');
    }

    const formData = new FormData();
    formData.append('content', content);
    if (file) {
      formData.append('image', file);
    }

    try {
      setLoading(true);
      await axios.post(`${API}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setFile(null);
      setPreview(null);
      dispatch(fetchPosts());
    } catch (err) {
      console.error('Post failed:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
      <textarea
        className="w-full border rounded-md p-2 mb-3 resize-none"
        placeholder="What's on your mind?"
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-3"
      />
      {preview && <img src={preview} alt="preview" className="rounded-md mb-3 max-h-64" />}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default CreatePost;
