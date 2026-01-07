import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPosts } from '../features/post/postSlice';

const CommentSection = ({ postId, comments }) => {
  const [text, setText] = useState('');
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const API = import.meta.env.VITE_API_URL;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`${API}/posts/comment/${postId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setText('');
      dispatch(fetchPosts());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleComment} className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
        >
          Post
        </button>
      </form>

      {comments?.map((comment, index) => (
        <div key={index} className="text-sm text-gray-700 mb-1">
          <strong>{comment.userId?.name || 'User'}:</strong> {comment.text}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
