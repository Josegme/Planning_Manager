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

