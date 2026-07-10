import { api } from './client';
import { Product } from '../types';

export const productsApi = {
  list: () => api.get<{ products: Product[] }>('/products'),
  create: (product: Product) => api.post<{ product: Product }>('/products', product),
  update: (id: string, product: Partial<Product>) => api.put<{ product: Product }>(`/products/${id}`, product),
  remove: (id: string) => api.delete<void>(`/products/${id}`),
  updateStock: (id: string, stock: number) =>
    api.patch<{ product: Product }>(`/products/${id}/stock`, { stock }),
};
