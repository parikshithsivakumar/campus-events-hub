import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { Role, User } from '../types/models';
import { mockUser } from '../utils/mockData';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (params: { token: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as User) : mockUser;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login: ({ token: nextToken, user: nextUser }) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem('access_token', nextToken);
        localStorage.setItem('auth_user', JSON.stringify(nextUser));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('auth_user');
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }
  return ctx;
}
