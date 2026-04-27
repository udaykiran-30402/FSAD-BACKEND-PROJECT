import { createContext, useContext, useMemo, useState } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();
const AUTH_KEY = 'tribalcraft_user';
const USERS_KEY = 'tribalcraft_admin_users';

const getStoredUser = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  const login = async ({ email, password, role }) => {
    const response = await API.post('/auth/login', {
      email,
      password,
      role: String(role).toUpperCase(),
    });

    const userData = response.data?.data;
    const loggedInUser = {
      id: userData?.id,
      name: userData?.name || String(email).split('@')[0],
      email: userData?.email || email,
      role: String(userData?.role || role).toLowerCase(),
      phone: userData?.phone || '',
      address: userData?.address || '',
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async ({ name, email, password, role, phone = '', address = '' }) => {
    const response = await API.post('/auth/register', {
      name,
      email,
      password,
      role: String(role).toUpperCase(),
      phone,
      address,
    });

    return response.data?.data;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthProvider;
