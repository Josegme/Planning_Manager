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

