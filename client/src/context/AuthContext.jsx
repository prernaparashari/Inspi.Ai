import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, signup as signupApi, fetchMe, updateAvatarOnServer } from '../services/authApi';

const AuthContext = createContext(null);
const TOKEN_KEY = 'inspiai:token';

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState({ name: '', email: '', avatar: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // true while we check for a saved session

  // On app load, if a token is saved, ask the backend who that is.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token)
      .then(({ user }) => {
        setProfile(user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  // Throws on failure — the caller (AuthForm) shows the error message.
  const login = async (email, password) => {
    const { token, user } = await loginApi(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setProfile(user);
    setIsAuthenticated(true);
  };

  const signup = async (name, email, password) => {
    const { token, user } = await signupApi(name, email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setProfile(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setProfile({ name: '', email: '', avatar: null });
  };

  const updateAvatar = async (avatarDataUrl) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    setProfile((prev) => ({ ...prev, avatar: avatarDataUrl }));
    
    try {
      await updateAvatarOnServer(token, avatarDataUrl);
    } catch (e) {
      console.error('Could not save avatar to the server:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ profile, isAuthenticated, loading, login, signup, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}