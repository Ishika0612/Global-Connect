import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { FaBell, FaCheck } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { addNotification, markAllRead } from '../features/notification/notificationSlice';

const Notification = () => {
  const [loading, setLoading] = useState(true);
  const { items } = useSelector(state => state.notification);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) return;

    const socket = io(API, { withCredentials: true });
    socket.emit('register', token);

    socket.on('new_notification', (notif) => {
      dispatch(addNotification(notif));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        res.data.forEach((notif) => dispatch(addNotification(notif)));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(markAllRead()); // you can make a markOneRead too
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const formatTime = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const units = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    for (let unit of units) {
      const count = Math.floor(diff / unit.seconds);
      if (count >= 1) return `${count} ${unit.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  if (loading) return <div className="p-6 text-gray-500">Loading notifications...</div>;
  if (!items.length) return <div className="p-6 text-gray-500">No notifications yet.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaBell /> Notifications
      </h2>
      <div className="space-y-4">
        {items.map(notification => (
          <div
            key={notification._id}
            className={`p-4 rounded-md shadow flex justify-between items-start transition ${
              notification.read ? 'bg-gray-100' : 'bg-yellow-50'
            }`}
          >
            <div>
              <p className="text-gray-800 text-sm mb-1">{notification.content}</p>
              <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
            </div>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification._id)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaCheck /> Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
