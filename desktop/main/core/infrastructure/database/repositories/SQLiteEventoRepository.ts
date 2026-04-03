import Database from 'better-sqlite3';
import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { Evento } from '../../../domain/entities/Evento';
import { EventoMapper, EventoRow } from '../mappers/EventoMapper';

export class SQLiteEventoRepository implements IEventoRepository {
  constructor(private db: Database.Database) {}

  async create(evento: Evento): Promise<Evento> {
    const row = EventoMapper.toRow(evento);
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO eventos (
        id, nombre, tipo, fecha, hora, lugar, descripcion,
        estado, tiene_mesas, cantidad_mesas, capacidad_mesa,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      row.id,
      row.nombre,
      row.tipo,
      row.fecha,
      row.hora,
      row.lugar,
      row.descripcion,
      row.estado,
      row.tiene_mesas,
      row.cantidad_mesas,
      row.capacidad_mesa,
      now,
      now
    );

    return evento;
  }

  async findById(id: string): Promise<Evento | null> {
    const row = this.db.prepare('SELECT * FROM eventos WHERE id = ?').get(id) as EventoRow | undefined;
    
    if (!row) {
      return null;
    }

    return EventoMapper.toEntity(row);
  }

  private static readonly HIDDEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

  async findAll(): Promise<Evento[]> {
    const now = Date.now();
    const cutoff = now - SQLiteEventoRepository.HIDDEN_DAYS_MS;
    this.db.prepare('DELETE FROM eventos WHERE deleted_at IS NOT NULL AND deleted_at < ?').run(cutoff);
    const rows = this.db.prepare(
      'SELECT * FROM eventos WHERE deleted_at IS NULL ORDER BY fecha DESC, created_at DESC'
    ).all() as EventoRow[];
    return rows.map(row => EventoMapper.toEntity(row));
  }

  async findHidden(): Promise<Evento[]> {
    const now = Date.now();
    const cutoff = now - SQLiteEventoRepository.HIDDEN_DAYS_MS;
    this.db.prepare('DELETE FROM eventos WHERE deleted_at IS NOT NULL AND deleted_at < ?').run(cutoff);
    const rows = this.db.prepare(
      'SELECT * FROM eventos WHERE deleted_at IS NOT NULL AND deleted_at >= ? ORDER BY deleted_at DESC'
    ).all(cutoff) as EventoRow[];
    return rows.map(row => EventoMapper.toEntity(row));
  }

  async softDelete(id: string): Promise<void> {
    this.db.prepare('UPDATE eventos SET deleted_at = ? WHERE id = ?').run(Date.now(), id);
  }

  async recover(id: string): Promise<void> {
    this.db.prepare('UPDATE eventos SET deleted_at = NULL WHERE id = ?').run(id);
  }

  async findByEstado(estado: string): Promise<Evento[]> {
    const rows = this.db.prepare('SELECT * FROM eventos WHERE estado = ? ORDER BY fecha DESC').all(estado) as EventoRow[];
    
    return rows.map(row => EventoMapper.toEntity(row));
  }

  async update(evento: Evento): Promise<Evento> {
    const row = EventoMapper.toRow(evento);
    const now = new Date().toISOString();

    this.db.prepare(`
      UPDATE eventos SET
        nombre = ?,
        tipo = ?,
        fecha = ?,
        hora = ?,
        lugar = ?,
        descripcion = ?,
        estado = ?,
        tiene_mesas = ?,
        cantidad_mesas = ?,
        capacidad_mesa = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      row.nombre,
      row.tipo,
      row.fecha,
      row.hora,
      row.lugar,
      row.descripcion,
      row.estado,
      row.tiene_mesas,
      row.cantidad_mesas,
      row.capacidad_mesa,
      now,
      evento.id
    );

    return evento;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM eventos WHERE id = ?').run(id);
  }

  async exists(id: string): Promise<boolean> {
    const result = this.db.prepare('SELECT 1 FROM eventos WHERE id = ?').get(id);
    return result !== undefined;
  }
}

