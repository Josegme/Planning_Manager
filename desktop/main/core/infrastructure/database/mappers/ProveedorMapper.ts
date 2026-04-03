import { Proveedor } from '../../../domain/entities/Proveedor';

export interface ProveedorRow {
  id: string;
  nombre: string;
  servicio_que_presta?: string | null;
  contacto: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  created_at: string;
  updated_at: string;
}

export class ProveedorMapper {
  static toEntity(row: ProveedorRow): Proveedor {
    return new Proveedor(
      row.id,
      row.nombre,
      row.servicio_que_presta ?? null,
      row.contacto,
      row.email,
      row.telefono,
      row.direccion,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  static toRow(proveedor: Proveedor): ProveedorRow {
    return {
      id: proveedor.id,
      nombre: proveedor.nombre,
      servicio_que_presta: proveedor.servicioQuePresta,
      contacto: proveedor.contacto,
      email: proveedor.email,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      created_at: proveedor.createdAt.toISOString(),
      updated_at: proveedor.updatedAt.toISOString(),
    };
  }
}

