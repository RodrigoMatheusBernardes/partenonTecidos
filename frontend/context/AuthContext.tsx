'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authGet, logoutSession, refreshSession, setupAuthInterceptors } from '@/lib/auth';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupAuthInterceptors();

    const syncSession = async () => {
      try {
        const response = await authGet(`/api/auth/me`);
        setToken('cookie-session');
        setUser(response.data);
      } catch {
        try {
          await refreshSession();
          const me = await authGet(`/api/auth/me`);
          setToken('cookie-session');
          setUser(me.data);
        } catch {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    syncSession();
  }, []);

  const login = (userData: User, newToken?: string) => {
    setToken(newToken || 'cookie-session');
    setUser(userData);
  };

  const logout = async () => {
    await logoutSession();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, isSeller, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}