export interface UpdateServicioDTO {
  id: string;
  proveedorId?: string | null;
  nombre?: string;
  descripcion?: string | null;
  costoUnitario?: number;
  cantidad?: number;
  moneda?: string;
  estado?: string;
  pagosParciales?: number;
}

