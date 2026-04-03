// Tipos compartidos para el renderer (solo para TypeScript)

export enum EstadoInvitado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

export interface Invitado {
  id: string;
  eventoId: string;
  dni: string | null;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  grupo: string | null;
  menu: string | null;
  mesaId: string | null;
  qrCode: string | null;
  estado: EstadoInvitado;
  acompanantesEsperados: number;
  acompanantesReales: number;
  checkinAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvitadoDTO {
  eventoId: string;
  dni?: string | null;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  grupo?: string | null;
  menu?: string | null;
  mesaId?: string | null;
  acompanantesEsperados?: number;
}

export interface UpdateInvitadoDTO {
  id: string;
  dni?: string | null;
  nombre?: string;
  apellido?: string;
  email?: string | null;
  telefono?: string | null;
  grupo?: string | null;
  menu?: string | null;
  mesaId?: string | null;
  acompanantesEsperados?: number;
}

export interface ImportInvitadosDTO {
  eventoId: string;
  invitados: Array<{
    dni?: string | null;
    nombre: string;
    apellido: string;
    email?: string | null;
    telefono?: string | null;
    grupo?: string | null;
    menu?: string | null;
    acompanantesEsperados?: number;
  }>;
}

export interface ImportResult {
  exitosos: Invitado[];
  errores: Array<{ fila: number; datos: any; error: string }>;
}

