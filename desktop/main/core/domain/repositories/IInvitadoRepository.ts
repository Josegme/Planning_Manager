import { Invitado } from '../entities/Invitado';

export interface IInvitadoRepository {
  create(invitado: Invitado): Promise<Invitado>;
  findById(id: string): Promise<Invitado | null>;
  findByEventoId(eventoId: string): Promise<Invitado[]>;
  findByMesaId(mesaId: string): Promise<Invitado[]>;
  findByDNI(dni: string, eventoId: string): Promise<Invitado | null>;
  findByEmail(email: string, eventoId: string): Promise<Invitado | null>;
  update(invitado: Invitado): Promise<Invitado>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  countByEventoId(eventoId: string): Promise<number>;
  countByEstado(eventoId: string, estado: string): Promise<number>;
}

