import api from '@/lib/api';
import { Producto } from '@/types';

export const productosService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get<Producto[]>('/api/productos/productos/');
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await api.get<Producto>(`/api/productos/productos/${id}/`);
    return response.data;
  },

  create: async (data: Producto): Promise<Producto> => {
    const response = await api.post<Producto>('/api/productos/productos/', data);
    return response.data;
  },

  update: async (id: number, data: Producto): Promise<Producto> => {
    const response = await api.put<Producto>(`/api/productos/productos/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/productos/productos/${id}/`);
  },
};
