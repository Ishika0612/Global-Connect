import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/post/postSlice";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import NotificationSidebar from "../components/NotificationSidebar"; // ✅ Import sidebar

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchPosts());
  }, [dispatch, user]);

  if (!user)
    return (
      <div className="p-6 text-gray-600">Please log in to view the feed.</div>
    );

  return (
    <div className="flex">
      {/* Main Feed */}
      <div className="flex-1 p-6 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          📢 Global Feed
        </h2>
        <CreatePost />
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>

      {/* Notification Sidebar */}
      <div className="w-72 border-l border-gray-200 bg-white">
        <NotificationSidebar />
      </div>
    </div>
  );
};

export default Feed;
