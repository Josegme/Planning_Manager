import { Evento } from '../entities/Evento';

export interface IEventoRepository {
  create(evento: Evento): Promise<Evento>;
  findById(id: string): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  findByEstado(estado: string): Promise<Evento[]>;
  update(evento: Evento): Promise<Evento>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

