// src/context/AuthContext.js - Global authentication state management
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'government' or 'company'
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved auth on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('tms_user');
    const savedRole = localStorage.getItem('tms_role');
    const savedToken = localStorage.getItem('tms_token');

    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, userRole, userToken = null) => {
    setUser(userData);
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem('tms_user', JSON.stringify(userData));
    localStorage.setItem('tms_role', userRole);
    if (userToken) localStorage.setItem('tms_token', userToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('tms_user');
    localStorage.removeItem('tms_role');
    localStorage.removeItem('tms_token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
