export interface CreateServicioDTO {
  eventoId: string;
  proveedorId?: string | null;
  nombre: string;
  descripcion?: string | null;
  costoUnitario: number;
  cantidad?: number;
  moneda?: string;
}

