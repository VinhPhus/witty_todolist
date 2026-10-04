import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password, rememberMe);
      } else {
        await register(email, password, displayName || email.split('@')[0], rememberMe);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-sm glass rounded-[40px] p-8 z-10 relative overflow-hidden">
        {/* Glossy highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center mb-8 relative z-10">
          <img src="/w-logo.png" alt="Witty Logo" className="w-24 h-24 object-contain dark:invert drop-shadow-md" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mt-2">Witty Todo</h1>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên hiển thị</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="Tên của bạn" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="••••••••" minLength="8" />
          </div>
          
          <div className="flex items-center mt-2">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-50 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Duy trì đăng nhập
            </label>
          </div>
          <button type="submit" className="w-full bg-primary text-white rounded-xl py-3 font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-600 transition-all hover:scale-[1.02] active:scale-95 mt-4 cursor-pointer">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 relative z-10">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold">
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
