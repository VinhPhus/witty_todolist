import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const res = await api.post('/auth/login', { email, password });
    const storage = rememberMe ? localStorage : sessionStorage;
    // Clear the other storage just in case
    (rememberMe ? sessionStorage : localStorage).removeItem('token');
    (rememberMe ? sessionStorage : localStorage).removeItem('user');
    storage.setItem('token', res.data.accessToken);
    storage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (email, password, displayName, rememberMe = true) => {
    const res = await api.post('/auth/register', { email, password, displayName });
    const storage = rememberMe ? localStorage : sessionStorage;
    (rememberMe ? sessionStorage : localStorage).removeItem('token');
    (rememberMe ? sessionStorage : localStorage).removeItem('user');
    storage.setItem('token', res.data.accessToken);
    storage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
