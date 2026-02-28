import api from '@/lib/api';
import { BotConfig } from '@/types';

export const botService = {
  getAll: async (): Promise<BotConfig[]> => {
    const response = await api.get<BotConfig[]>('/api/bot/');
    return response.data;
  },

  getById: async (id: number): Promise<BotConfig> => {
    const response = await api.get<BotConfig>(`/api/bot/${id}/`);
    return response.data;
  },

  create: async (data: BotConfig): Promise<BotConfig> => {
    const response = await api.post<BotConfig>('/api/bot/', data);
    return response.data;
  },

  update: async (id: number, data: BotConfig): Promise<BotConfig> => {
    const response = await api.put<BotConfig>(`/api/bot/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/bot/${id}/`);
  },
};
