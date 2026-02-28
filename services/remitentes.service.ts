import api from '@/lib/api';
import { Remitente } from '@/types';

export const remitentesService = {
  getAll: async (): Promise<Remitente[]> => {
    const response = await api.get<Remitente[]>('/api/remitentes/remitentes/');
    return response.data;
  },

  getById: async (id: number): Promise<Remitente> => {
    const response = await api.get<Remitente>(`/api/remitentes/remitentes/${id}/`);
    return response.data;
  },

  create: async (data: Remitente): Promise<Remitente> => {
    const response = await api.post<Remitente>('/api/remitentes/remitentes/', data);
    return response.data;
  },

  update: async (id: number, data: Remitente): Promise<Remitente> => {
    const response = await api.put<Remitente>(`/api/remitentes/remitentes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/remitentes/remitentes/${id}/`);
  },
};
