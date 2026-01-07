import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import SocialLogin from '../components/SocialLogin'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      dispatch(setUser(user));
      navigate('/');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

       <SocialLogin />

      <div className="relative text-center text-gray-400 mb-4">
        <span className="bg-white px-2 relative z-10">or</span>
        <hr className="absolute top-1/2 left-0 w-full border-gray-300 -z-10" />
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
