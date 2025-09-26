import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, id }
  const [token, setToken] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        setToken(storedToken);
      } catch (e) {
        console.error('Invalid token in storage, clearing...', e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    const receivedToken = res.data?.token;
    if (!receivedToken) throw new Error('Login failed: No token returned');
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    const decoded = jwtDecode(receivedToken);
    setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
    return decoded;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};