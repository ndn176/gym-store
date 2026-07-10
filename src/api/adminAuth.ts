import { api } from './client';

interface AdminProfile {
  name: string;
  email: string;
}

export const adminAuthApi = {
  login: (payload: { email: string; password: string }) =>
    api.post<{ admin: AdminProfile }>('/admin/auth/login', payload),

  logout: () => api.post<void>('/admin/auth/logout'),

  me: () => api.get<{ admin: AdminProfile }>('/admin/auth/me'),
};
