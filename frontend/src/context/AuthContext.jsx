import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'https://library-management-system-backend-wav6.onrender.com/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on load
    const storedUser = localStorage.getItem('library_user');
    const storedToken = localStorage.getItem('library_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Axios interceptor to attach JWT token to every request dynamically
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('library_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Register User
  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      
      const { token, ...userData } = res.data;
      localStorage.setItem('library_token', token);
      localStorage.setItem('library_user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      const { token, ...userData } = res.data;
      localStorage.setItem('library_token', token);
      localStorage.setItem('library_user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed',
      };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('library_token');
    localStorage.removeItem('library_user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
