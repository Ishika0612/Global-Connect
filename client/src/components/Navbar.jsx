import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Global Connect</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/feed">Feed</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/profile">Profile</Link>
            {user.email === 'admin@global.com' && <Link to="/admin">Admin</Link>}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
