import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Use test credentials for now or real API if backed is running
    await login('test@witty.com', 'password123').catch(() => {
       // just fake login if backend not ready
       localStorage.setItem('token', 'fake-token');
       localStorage.setItem('user', JSON.stringify({ displayName: 'Test User' }));
       window.location.href = '/';
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/50">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Witty.</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-primary text-white rounded-xl py-3 font-semibold shadow-md shadow-blue-200 hover:bg-blue-600 transition-colors mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
