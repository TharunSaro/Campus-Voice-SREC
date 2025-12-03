import React, { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { email, role: 'student'|'admin' }

  const login = (email, password) => {
    const isSrecEmail = /@srec\.ac\.in$/i.test(email);
    if (!isSrecEmail) {
      return { ok: false, message: 'Please use your @srec.ac.in email.' };
    }
    // Mock auth: password not validated; derive role from email prefix 'admin'
    const role = email.toLowerCase().startsWith('admin') ? 'admin' : 'student';
    const authUser = { email, role };
    setUser(authUser);
    if (role === 'admin') navigate('/admin'); else navigate('/');
    return { ok: true };
  };

  // Mock signup: set user so onboarding can run without redirecting yet
  const signup = (email) => {
    const isSrecEmail = /@srec\.ac\.in$/i.test(email);
    if (!isSrecEmail) {
      return { ok: false, message: 'Please use your @srec.ac.in email.' };
    }
    const role = email.toLowerCase().startsWith('admin') ? 'admin' : 'student';
    setUser({ email, role });
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(() => ({ user, login, logout, signup }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

