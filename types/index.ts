// Base types for the application

export interface User {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Cliente {
  id?: number;
  dni: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  notas?: string;
  email?: string;
  channel?: 'whatsapp' | 'facebook' | 'instagram' | 'web';
  user?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion?: string;
  coste_sin_iva?: number;
  coste_con_iva: number;
  duracion?: number;
  servicio_productos?: ServicioProducto[];
  created_at?: string;
  updated_at?: string;
}

export interface ServicioProducto {
  id?: number;
  servicio?: number;
  producto?: number;
  cantidad: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Cita {
  id?: number;
  cliente: number;
  cliente_nombre?: string;
  fecha_hora: string;
  servicio?: number;
  servicio_nombre?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Historico {
  id?: number;
  cliente: number;
  cliente_nombre?: string;
  fecha_consulta: string;
  servicios: number[];
  servicios_nombres?: string[];
  apuntes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Factura {
  id?: number;
  numero: string;
  fecha: string;
  cliente: number;
  cliente_nombre?: string;
  historico?: number;
  estado: 'borrador' | 'emitida' | 'pagada' | 'vencida' | 'cancelada';
  total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Remitente {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  nif?: string;
  created_at?: string;
  updated_at?: string;
}

export interface File {
  id?: number;
  nombre: string;
  archivo: string;
  descripcion?: string;
  cliente?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BotConfig {
  id?: number;
  nombre: string;
  prompt?: string;
  modelo?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  key?: string;
  token?: string;
  username?: string;
  email?: string;
  user?: User;
}
