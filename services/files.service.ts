import api from '@/lib/api';
import { File } from '@/types';

export const filesService = {
  getAll: async (): Promise<File[]> => {
    const response = await api.get<File[]>('/api/files/files/');
    return response.data;
  },

  getById: async (id: number): Promise<File> => {
    const response = await api.get<File>(`/api/files/files/${id}/`);
    return response.data;
  },

  create: async (data: FormData): Promise<File> => {
    const response = await api.post<File>('/api/files/files/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<File> => {
    const response = await api.put<File>(`/api/files/files/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/files/files/${id}/`);
  },
};
