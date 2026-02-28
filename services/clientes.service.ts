import api from '@/lib/api';
import { Cliente } from '@/types';

export const clientesService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/api/clientes/clientes/');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/api/clientes/clientes/${id}/`);
    return response.data;
  },

  create: async (data: Cliente): Promise<Cliente> => {
    const response = await api.post<Cliente>('/api/clientes/clientes/', data);
    return response.data;
  },

  update: async (id: number, data: Cliente): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/api/clientes/clientes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/clientes/clientes/${id}/`);
  },
};
