import { Evento, EstadoEvento } from '../../../domain/entities/Evento';
import Database from 'better-sqlite3';

export interface EventoRow {
  id: string;
  nombre: string;
  tipo: string | null;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
  estado: string;
  tiene_mesas: number;
  cantidad_mesas: number;
  capacidad_mesa: number;
  created_at: string;
  updated_at: string;
  deleted_at?: number | null;
}

export class EventoMapper {
  static toEntity(row: EventoRow): Evento {
    return new Evento(
      row.id,
      row.nombre,
      row.tipo,
      row.fecha,
      row.hora,
      row.lugar,
      row.descripcion,
      row.estado as EstadoEvento,
      row.tiene_mesas === 1,
      row.cantidad_mesas,
      row.capacidad_mesa,
      new Date(row.created_at),
      new Date(row.updated_at),
      row.deleted_at ?? undefined
    );
  }

  static toRow(evento: Evento): Omit<EventoRow, 'created_at' | 'updated_at'> {
    return {
      id: evento.id,
      nombre: evento.nombre,
      tipo: evento.tipo,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      estado: evento.estado,
      tiene_mesas: evento.tieneMesas ? 1 : 0,
      cantidad_mesas: evento.cantidadMesas,
      capacidad_mesa: evento.capacidadMesa,
    };
  }
}

