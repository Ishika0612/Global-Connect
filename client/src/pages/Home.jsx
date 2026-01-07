import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Home = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Global Connect</h1>

      {user ? (
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Hello, {user.name} 👋</h2>
          <p>You're logged in. Go explore your feed or chat with others.</p>
          <div className="mt-4 flex gap-4">
            <Link to="/feed" className="text-blue-600 hover:underline">Feed</Link>
            <Link to="/chat" className="text-blue-600 hover:underline">Chat</Link>
            <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
            <Link to="/jobs" className="text-blue-600 hover:underline">Jobs</Link>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="mb-2">Please log in or register to start connecting.</p>
          <Link to="/login" className="mr-4 text-blue-600 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
