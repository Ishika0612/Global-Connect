import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const { unreadCount } = useSelector(state => state.notification);

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 p-6">
      <nav className="flex flex-col gap-4">
        <Link
          to="/feed"
          className={`flex items-center gap-2 text-lg font-medium ${location.pathname === '/feed' ? 'text-blue-600' : 'text-gray-700'}`}
        >
          <FaHome /> Feed
        </Link>
        <Link
          to="/notifications"
          className={`relative flex items-center gap-2 text-lg font-medium ${location.pathname === '/notifications' ? 'text-blue-600' : 'text-gray-700'}`}
        >
          <FaBell />
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
              {unreadCount}
            </span>
          )}
        </Link>
        {/* Add other sidebar links here */}
      </nav>
    </div>
  );
};

export default Sidebar;
