export interface Proveedor {
  id: string;
  nombre: string;
  servicioQuePresta?: string | null;
  contacto: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProveedorDTO {
  nombre: string;
  servicioQuePresta?: string | null;
  contacto?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

export interface UpdateProveedorDTO {
  id: string;
  nombre?: string;
  servicioQuePresta?: string | null;
  contacto?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

