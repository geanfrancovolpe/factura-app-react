import api from '@/lib/api';
import { Cita } from '@/types';

export const citasService = {
  getAll: async (): Promise<Cita[]> => {
    const response = await api.get<Cita[]>('/api/citas/citas/');
    return response.data;
  },

  getById: async (id: number): Promise<Cita> => {
    const response = await api.get<Cita>(`/api/citas/citas/${id}/`);
    return response.data;
  },

  create: async (data: Cita): Promise<Cita> => {
    const response = await api.post<Cita>('/api/citas/citas/', data);
    return response.data;
  },

  update: async (id: number, data: Cita): Promise<Cita> => {
    const response = await api.put<Cita>(`/api/citas/citas/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/citas/citas/${id}/`);
  },
};
