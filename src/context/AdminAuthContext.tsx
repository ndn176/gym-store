import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { adminAuthApi } from '../api/adminAuth';
import { ApiError } from '../api/client';

interface AdminProfile {
  name: string;
  email: string;
}

interface AdminAuthContextValue {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAuthApi
      .me()
      .then(({ admin: profile }) => setAdmin(profile))
      .catch(() => {
        /* not logged in as admin — expected by default */
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const { admin: profile } = await adminAuthApi.login({ email, password });
      setAdmin(profile);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng nhập quản trị thất bại.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    adminAuthApi.logout().catch(() => {});
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, isAuthenticated: !!admin, loading, error, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}
