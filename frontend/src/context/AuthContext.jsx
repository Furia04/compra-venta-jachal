import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate token with backend in background
          const freshUser = await api.getMe();
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          }
        } catch (err) {
          console.warn('Sesión expirada o inválida:', err.message);
          logout();
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      const userObj = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      return userObj;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
