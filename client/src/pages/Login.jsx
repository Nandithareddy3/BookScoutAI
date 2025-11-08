import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); 
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(res.data.token, res.data.userName);
      navigate('/profile');

    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-zinc-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;