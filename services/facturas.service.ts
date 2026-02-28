import api from '@/lib/api';
import { Factura } from '@/types';

export const facturasService = {
  getAll: async (): Promise<Factura[]> => {
    const response = await api.get<Factura[]>('/api/facturas/facturas/');
    return response.data;
  },

  getById: async (id: number): Promise<Factura> => {
    const response = await api.get<Factura>(`/api/facturas/facturas/${id}/`);
    return response.data;
  },

  create: async (data: Factura): Promise<Factura> => {
    const response = await api.post<Factura>('/api/facturas/facturas/', data);
    return response.data;
  },

  update: async (id: number, data: Factura): Promise<Factura> => {
    const response = await api.put<Factura>(`/api/facturas/facturas/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/facturas/facturas/${id}/`);
  },
};
