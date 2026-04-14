import React, { createContext, useState, useEffect } from 'react';
import { login, register, getMe } from '../api/kanban';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setToken(data.token);
    setUser({ _id: data._id, username: data.username, email: data.email });
  };

  const handleRegister = async (username, email, password) => {
    const data = await register(username, email, password);
    setToken(data.token);
    setUser({ _id: data._id, username: data.username, email: data.email });
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
