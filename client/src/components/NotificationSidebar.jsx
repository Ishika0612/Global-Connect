import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const NotificationSidebar = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [API, token]);

  return (
    <div className="p-4 h-screen overflow-y-auto border-l">
      <h2 className="text-lg font-semibold mb-3">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        notifications.map((notif) => {
          let displayText = notif.content;
          if (displayText.includes(user.name)) {
            displayText = displayText.replace(user.name, "You");
          }
          return (
            <div
              key={notif._id}
              className="p-2 mb-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              {displayText}
            </div>
          );
        })
      )}
    </div>
  );
};

export default NotificationSidebar;
