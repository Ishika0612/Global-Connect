import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../features/post/postSlice';

const EditPostModal = ({ post, closeModal, onPostUpdated }) => {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.image || null);
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();

    const postData = {
      content,
    };

    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        postData.imageBase64 = reader.result.split(',')[1];
        postData.mimeType = image.type;

        try {
          await axios.put(`${API}/posts/${post._id}`, postData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          closeModal();
          dispatch(fetchPosts());
          if (onPostUpdated) onPostUpdated();
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(image);
    } else {
      try {
        await axios.put(`${API}/posts/${post._id}`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        closeModal();
        dispatch(fetchPosts());
        if (onPostUpdated) onPostUpdated();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleUpdate}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="w-full border rounded p-2 mb-3"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="mb-2"
          />
          {preview && <img src={preview} alt="preview" className="rounded mb-3 max-h-48" />}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="text-gray-600 hover:underline">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
