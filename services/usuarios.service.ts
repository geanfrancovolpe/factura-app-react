import api from '@/lib/api';
import { User } from '@/types';

export const usuariosService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/usuarios/usuarios/');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/api/usuarios/usuarios/${id}/`);
    return response.data;
  },

  create: async (data: User): Promise<User> => {
    const response = await api.post<User>('/api/usuarios/usuarios/', data);
    return response.data;
  },

  update: async (id: number, data: User): Promise<User> => {
    const response = await api.put<User>(`/api/usuarios/usuarios/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/usuarios/usuarios/${id}/`);
  },
};
