import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchPosts } from '../features/post/postSlice';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedFile, setEditedFile] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const isOwner = user && user._id === (post.userId?._id || post.userId);
  const hasLiked = post.likes.includes(user?._id);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/posts/${post._id}`, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(fetchPosts());
    } catch (err) {
      console.error('Delete error:', err);
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', editedContent);
      if (editedFile) formData.append('image', editedFile);

      await axios.put(`${API}/posts/${post._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setIsEditing(false);
      dispatch(fetchPosts());
    } catch (err) {
      console.error('Update error:', err);
    } finally { setLoading(false); }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${API}/posts/like/${post._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(fetchPosts());
    } catch (err) { console.error('Like error:', err); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API}/posts/comment/${post._id}`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText('');
      dispatch(fetchPosts());
    } catch (err) { console.error('Comment error:', err); }
  };

  return (
    <div className="bg-white border hover:shadow-xl transition-shadow duration-300 rounded-xl p-5 mb-6 relative">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">
          {isOwner ? 'You' : post.userId?.name || 'Anonymous'}
        </h3>
        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border mt-2 p-2 rounded text-sm"
            rows={3}
          />
          <input type="file" accept="image/*" onChange={(e) => setEditedFile(e.target.files[0])} className="mt-2" />
          <div className="mt-3 flex gap-3">
            <button onClick={handleUpdate} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-gray-700">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="mt-3 w-full max-h-96 object-contain rounded-lg border"
            />
          )}
        </>
      )}

      <div className="mt-4 flex gap-5 items-center text-sm text-gray-700">
        <button onClick={handleLike} className="hover:text-blue-600">
          {hasLiked ? '💙 Liked' : '🤍 Like'} ({post.likes.length})
        </button>
        <button onClick={() => setShowComments(p => !p)} className="hover:text-blue-600">
          💬 Comments ({post.comments.length})
        </button>
        {isOwner && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)} className="hover:text-green-600">✏️ Edit</button>
            <button onClick={handleDelete} className="hover:text-red-600">🗑️ Delete</button>
          </>
        )}
      </div>

      {showComments && (
        <div className="mt-4 bg-gray-50 p-3 rounded">
          {post.comments.map((c, i) => (
            <div key={i} className="mb-2">
              <span className="text-sm font-semibold">
                {c.userId?._id === user?._id ? 'You' : c.userId?.name || 'Anonymous'}:
              </span>
              <span className="ml-2 text-sm">{c.text}</span>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border p-2 text-sm rounded"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleComment} className="bg-blue-600 text-white px-3 py-1 rounded">
              Post
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center rounded-xl">
          <div className="text-blue-600 font-semibold animate-pulse">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
