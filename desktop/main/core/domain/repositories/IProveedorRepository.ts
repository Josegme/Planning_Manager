import { Proveedor } from '../entities/Proveedor';

export interface IProveedorRepository {
  create(proveedor: Proveedor): Promise<Proveedor>;
  findById(id: string): Promise<Proveedor | null>;
  findAll(): Promise<Proveedor[]>;
  update(proveedor: Proveedor): Promise<Proveedor>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

