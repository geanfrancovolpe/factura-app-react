import api from '@/lib/api';
import { Historico } from '@/types';

export const historicosService = {
  getAll: async (): Promise<Historico[]> => {
    const response = await api.get<Historico[]>('/api/historicos/historicos/');
    return response.data;
  },

  getById: async (id: number): Promise<Historico> => {
    const response = await api.get<Historico>(`/api/historicos/historicos/${id}/`);
    return response.data;
  },

  create: async (data: Historico): Promise<Historico> => {
    const response = await api.post<Historico>('/api/historicos/historicos/', data);
    return response.data;
  },

  update: async (id: number, data: Historico): Promise<Historico> => {
    const response = await api.put<Historico>(`/api/historicos/historicos/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/historicos/historicos/${id}/`);
  },
};
