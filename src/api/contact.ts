import { api } from './client';

export const contactApi = {
  send: (payload: { name: string; email: string; subject?: string; message: string }) =>
    api.post<{ message: string }>('/contact', payload),
};
