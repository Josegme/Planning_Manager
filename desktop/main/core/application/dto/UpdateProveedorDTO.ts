export interface UpdateProveedorDTO {
  id: string;
  nombre?: string;
  servicioQuePresta?: string | null;
  contacto?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

