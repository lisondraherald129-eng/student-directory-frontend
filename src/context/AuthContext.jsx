import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  async function login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Backend returns { error: "..." }
      throw new Error(data.message || data.error || 'Invalid credentials');
    }

    setToken(data.token);
    const nextUser = data.user || { email };
    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));

    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // banana: logout clears the session
  }

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}