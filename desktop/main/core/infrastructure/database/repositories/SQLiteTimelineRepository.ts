import Database from 'better-sqlite3';
import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa } from '../../../domain/entities/TimelineEtapa';
import { TimelineMapper, TimelineRow } from '../mappers/TimelineMapper';

export class SQLiteTimelineRepository implements ITimelineRepository {
  constructor(private db: Database.Database) {}

  async create(etapa: TimelineEtapa): Promise<TimelineEtapa> {
    const row = TimelineMapper.toRow(etapa);
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO timeline_etapas (
        id, evento_id, nombre, descripcion, hora_planificada,
        duracion_estimada, estado, hora_inicio_real, hora_fin_real,
        retraso_minutos, orden, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      row.id,
      row.evento_id,
      row.nombre,
      row.descripcion,
      row.hora_planificada,
      row.duracion_estimada,
      row.estado,
      row.hora_inicio_real,
      row.hora_fin_real,
      row.retraso_minutos,
      row.orden,
      now,
      now
    );

    return etapa;
  }

  async findById(id: string): Promise<TimelineEtapa | null> {
    const row = this.db.prepare('SELECT * FROM timeline_etapas WHERE id = ?').get(id) as TimelineRow | undefined;
    
    if (!row) {
      return null;
    }

    return TimelineMapper.toEntity(row);
  }

  async findByEventoId(eventoId: string): Promise<TimelineEtapa[]> {
    const rows = this.db.prepare('SELECT * FROM timeline_etapas WHERE evento_id = ? ORDER BY orden').all(eventoId) as TimelineRow[];
    
    return rows.map(row => TimelineMapper.toEntity(row));
  }

  async update(etapa: TimelineEtapa): Promise<TimelineEtapa> {
    const row = TimelineMapper.toRow(etapa);
    const now = new Date().toISOString();

    this.db.prepare(`
      UPDATE timeline_etapas SET
        nombre = ?,
        descripcion = ?,
        hora_planificada = ?,
        duracion_estimada = ?,
        estado = ?,
        hora_inicio_real = ?,
        hora_fin_real = ?,
        retraso_minutos = ?,
        orden = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      row.nombre,
      row.descripcion,
      row.hora_planificada,
      row.duracion_estimada,
      row.estado,
      row.hora_inicio_real,
      row.hora_fin_real,
      row.retraso_minutos,
      row.orden,
      now,
      etapa.id
    );

    return etapa;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM timeline_etapas WHERE id = ?').run(id);
  }

  async exists(id: string): Promise<boolean> {
    const result = this.db.prepare('SELECT 1 FROM timeline_etapas WHERE id = ?').get(id);
    return result !== undefined;
  }

  async updateOrden(etapas: { id: string; orden: number }[]): Promise<void> {
    const update = this.db.prepare('UPDATE timeline_etapas SET orden = ?, updated_at = ? WHERE id = ?');
    const now = new Date().toISOString();

    const transaction = this.db.transaction(() => {
      for (const etapa of etapas) {
        update.run(etapa.orden, now, etapa.id);
      }
    });

    transaction();
  }
}

