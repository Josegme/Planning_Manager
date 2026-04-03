export interface CreateProveedorDTO {
  nombre: string;
  servicioQuePresta?: string | null;
  contacto?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

