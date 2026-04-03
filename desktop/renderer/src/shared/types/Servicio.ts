export enum EstadoServicio {
  COTIZADO = 'cotizado',
  CONTRATADO = 'contratado',
  PAGADO = 'pagado',
  CANCELADO = 'cancelado',
}

export interface Servicio {
  id: string;
  eventoId: string;
  proveedorId: string | null;
  nombre: string;
  descripcion: string | null;
  costoUnitario: number;
  cantidad: number;
  costoTotal: number;
  moneda: string;
  estado: EstadoServicio;
  pagosParciales: number;
  porcentajePagado: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServicioDTO {
  eventoId: string;
  proveedorId?: string | null;
  nombre: string;
  descripcion?: string | null;
  costoUnitario: number;
  cantidad?: number;
  moneda?: string;
}

export interface UpdateServicioDTO {
  id: string;
  proveedorId?: string | null;
  nombre?: string;
  descripcion?: string | null;
  costoUnitario?: number;
  cantidad?: number;
  moneda?: string;
  estado?: EstadoServicio;
  pagosParciales?: number;
}

export interface EstadisticasFinancieras {
  total: number;
  pagado: number;
  pendiente: number;
  porProveedor: { proveedorId: string | null; nombre: string; total: number; pagado: number }[];
}

