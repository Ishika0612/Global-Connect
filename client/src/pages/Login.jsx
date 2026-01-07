import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import SocialLogin from '../components/SocialLogin';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled && loginUser.fulfilled.match(resultAction)) {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <SocialLogin />

      <div className="relative text-center text-gray-400 mb-4">
        <span className="bg-white px-2 relative z-10">or</span>
        <hr className="absolute top-1/2 left-0 w-full border-gray-300 -z-10" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="border w-full p-2 rounded"
          required
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Login;