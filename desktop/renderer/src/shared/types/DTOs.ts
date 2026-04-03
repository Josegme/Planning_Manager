// DTOs compartidos para el renderer

export interface CreateEventoDTO {
  nombre: string;
  tipo: string | null;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
  tieneMesas: boolean;
  cantidadMesas: number;
  capacidadMesa: number;
}

export interface UpdateEventoDTO {
  id: string;
  nombre?: string;
  tipo?: string | null;
  fecha?: string;
  hora?: string | null;
  lugar?: string | null;
  descripcion?: string | null;
  cantidadMesas?: number;
  capacidadMesa?: number;
}

