import { api } from './client';
import { UserProfile } from '../types';

export const authApi = {
  register: (payload: { name: string; email: string; phone?: string; password: string }) =>
    api.post<{ user: UserProfile }>('/auth/register', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<{ user: UserProfile }>('/auth/login', payload),

  logout: () => api.post<void>('/auth/logout'),

  me: () => api.get<{ user: UserProfile }>('/auth/me'),

  updateProfile: (payload: Partial<UserProfile>) => api.put<{ user: UserProfile }>('/auth/me', payload),

  forgotPassword: (email: string) => api.post<{ message: string }>('/auth/forgot-password', { email }),

  verifyResetCode: (email: string, code: string) =>
    api.post<{ valid: boolean }>('/auth/verify-reset-code', { email, code }),

  resetPassword: (email: string, code: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { email, code, password }),
};
