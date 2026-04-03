// Tipos compartidos para el renderer (solo para TypeScript)
// Las implementaciones reales están en main process

export enum EstadoEvento {
  PLANIFICACION = 'planificacion',
  ACTIVO = 'activo',
  FINALIZADO = 'finalizado',
}

export interface Evento {
  id: string;
  nombre: string;
  tipo: string | null;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
  estado: EstadoEvento;
  tieneMesas: boolean;
  cantidadMesas: number;
  capacidadMesa: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: number;
}

