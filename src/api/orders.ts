import { api } from './client';
import { Order } from '../types';

export const ordersApi = {
  // Customer (requires login)
  listMine: () => api.get<{ orders: Order[] }>('/orders'),
  cancelMine: (id: string) => api.patch<{ order: Order }>(`/orders/${id}/cancel`),

  // Checkout: works for both guests and logged-in customers
  place: (order: Order) => api.post<{ order: Order }>('/orders', order),

  // Admin
  listAll: () => api.get<{ orders: Order[] }>('/admin/orders'),
  updateStatus: (id: string, status: Order['status']) =>
    api.patch<{ order: Order }>(`/admin/orders/${id}/status`, { status }),
  cancelAny: (id: string) => api.patch<{ order: Order }>(`/admin/orders/${id}/cancel`),
};
