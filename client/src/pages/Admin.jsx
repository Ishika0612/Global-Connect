import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Admin = () => {
  const { user } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);

  // 🛡 Guard
  if (!user) return <div className="p-6 text-gray-600">Please log in to access admin panel.</div>;
  if (!user.isAdmin) return <div className="p-6 text-red-600 font-semibold">Access Denied. Admins only.</div>;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Admin Dashboard</h2>
      <h3 className="text-xl mb-2">All Registered Users:</h3>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u._id} className="bg-gray-100 p-3 rounded shadow">
            <div className="font-semibold">{u.name}</div>
            <div className="text-sm text-gray-600">{u.email}</div>
            <div className="text-xs text-gray-400">ID: {u._id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
