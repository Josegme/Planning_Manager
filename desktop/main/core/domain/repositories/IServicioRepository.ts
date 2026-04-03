import { Servicio } from '../entities/Servicio';

export interface IServicioRepository {
  create(servicio: Servicio): Promise<Servicio>;
  findById(id: string): Promise<Servicio | null>;
  findByEventoId(eventoId: string): Promise<Servicio[]>;
  findByProveedorId(proveedorId: string): Promise<Servicio[]>;
  update(servicio: Servicio): Promise<Servicio>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

