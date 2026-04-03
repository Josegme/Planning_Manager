import Database from 'better-sqlite3';
import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado } from '../../../domain/entities/Invitado';
import { InvitadoMapper, InvitadoRow } from '../mappers/InvitadoMapper';

export class SQLiteInvitadoRepository implements IInvitadoRepository {
  constructor(private db: Database.Database) {}

  async create(invitado: Invitado): Promise<Invitado> {
    const row = InvitadoMapper.toRow(invitado);
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO invitados (
        id, evento_id, dni, nombre, apellido, email, telefono,
        grupo, menu, mesa_id, qr_code, estado,
        acompanantes_esperados, acompanantes_reales, checkin_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      row.id,
      row.evento_id,
      row.dni,
      row.nombre,
      row.apellido,
      row.email,
      row.telefono,
      row.grupo,
      row.menu,
      row.mesa_id,
      row.qr_code,
      row.estado,
      row.acompanantes_esperados,
      row.acompanantes_reales,
      row.checkin_at,
      now,
      now
    );

    return invitado;
  }

  async findById(id: string): Promise<Invitado | null> {
    const row = this.db.prepare('SELECT * FROM invitados WHERE id = ?').get(id) as InvitadoRow | undefined;
    
    if (!row) {
      return null;
    }

    return InvitadoMapper.toEntity(row);
  }

  async findByEventoId(eventoId: string): Promise<Invitado[]> {
    const rows = this.db.prepare('SELECT * FROM invitados WHERE evento_id = ? ORDER BY apellido, nombre').all(eventoId) as InvitadoRow[];
    
    return rows.map(row => InvitadoMapper.toEntity(row));
  }

  async findByMesaId(mesaId: string): Promise<Invitado[]> {
    const rows = this.db.prepare('SELECT * FROM invitados WHERE mesa_id = ? ORDER BY apellido, nombre').all(mesaId) as InvitadoRow[];
    
    return rows.map(row => InvitadoMapper.toEntity(row));
  }

  async findByDNI(dni: string, eventoId: string): Promise<Invitado | null> {
    const row = this.db.prepare('SELECT * FROM invitados WHERE dni = ? AND evento_id = ?').get(dni, eventoId) as InvitadoRow | undefined;
    
    if (!row) {
      return null;
    }

    return InvitadoMapper.toEntity(row);
  }

  async findByEmail(email: string, eventoId: string): Promise<Invitado | null> {
    const row = this.db.prepare('SELECT * FROM invitados WHERE email = ? AND evento_id = ?').get(email, eventoId) as InvitadoRow | undefined;
    
    if (!row) {
      return null;
    }

    return InvitadoMapper.toEntity(row);
  }

  async update(invitado: Invitado): Promise<Invitado> {
    const row = InvitadoMapper.toRow(invitado);
    const now = new Date().toISOString();

    this.db.prepare(`
      UPDATE invitados SET
        dni = ?,
        nombre = ?,
        apellido = ?,
        email = ?,
        telefono = ?,
        grupo = ?,
        menu = ?,
        mesa_id = ?,
        qr_code = ?,
        estado = ?,
        acompanantes_esperados = ?,
        acompanantes_reales = ?,
        checkin_at = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      row.dni,
      row.nombre,
      row.apellido,
      row.email,
      row.telefono,
      row.grupo,
      row.menu,
      row.mesa_id,
      row.qr_code,
      row.estado,
      row.acompanantes_esperados,
      row.acompanantes_reales,
      row.checkin_at,
      now,
      invitado.id
    );

    return invitado;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM invitados WHERE id = ?').run(id);
  }

  async exists(id: string): Promise<boolean> {
    const result = this.db.prepare('SELECT 1 FROM invitados WHERE id = ?').get(id);
    return result !== undefined;
  }

  async countByEventoId(eventoId: string): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM invitados WHERE evento_id = ?').get(eventoId) as { count: number };
    return result.count;
  }

  async countByEstado(eventoId: string, estado: string): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM invitados WHERE evento_id = ? AND estado = ?').get(eventoId, estado) as { count: number };
    return result.count;
  }
}

