import api from '@/lib/api';
import { Servicio } from '@/types';

export const serviciosService = {
  getAll: async (): Promise<Servicio[]> => {
    const response = await api.get<Servicio[]>('/api/servicios/servicios/');
    return response.data;
  },

  getById: async (id: number): Promise<Servicio> => {
    const response = await api.get<Servicio>(`/api/servicios/servicios/${id}/`);
    return response.data;
  },

  create: async (data: Servicio): Promise<Servicio> => {
    const response = await api.post<Servicio>('/api/servicios/servicios/', data);
    return response.data;
  },

  update: async (id: number, data: Servicio): Promise<Servicio> => {
    const response = await api.put<Servicio>(`/api/servicios/servicios/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/servicios/servicios/${id}/`);
  },
};
