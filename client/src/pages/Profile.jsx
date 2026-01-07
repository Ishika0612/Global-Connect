import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EditPostModal from "../components/EditPostModal";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserPosts();
    }
  }, [user]);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`${API}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert(res.data.message); // ✅ success alert
        setPosts(posts.filter((p) => p._id !== postId)); // remove from UI
      } else {
        alert(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Server error while deleting post");
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
      <div className="bg-white rounded shadow p-4 space-y-2 mb-6">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>ID:</strong> {user._id}</div>
        <div><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</div>
      </div>

      <h3 className="text-xl font-semibold mb-3">📌 Your Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">You haven't posted anything yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white rounded shadow p-4 mb-4">
            <p className="mb-2">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="rounded mb-2 max-h-60"
              />
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setEditingPost(post)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          closeModal={() => {
            setEditingPost(null);
            fetchUserPosts(); // refresh after editing
          }}
        />
      )}
    </div>
  );
};

export default Profile;
