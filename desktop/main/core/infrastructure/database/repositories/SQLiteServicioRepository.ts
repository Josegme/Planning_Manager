import Database from 'better-sqlite3';
import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';
import { Servicio } from '../../../domain/entities/Servicio';
import { ServicioMapper, ServicioRow } from '../mappers/ServicioMapper';

export class SQLiteServicioRepository implements IServicioRepository {
  constructor(private db: Database.Database) {}

  async create(servicio: Servicio): Promise<Servicio> {
    const row = ServicioMapper.toRow(servicio);
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO servicios (
        id, evento_id, proveedor_id, nombre, descripcion,
        costo_unitario, cantidad, costo_total, moneda,
        estado, pagos_parciales, porcentaje_pagado,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      row.id,
      row.evento_id,
      row.proveedor_id,
      row.nombre,
      row.descripcion,
      row.costo_unitario,
      row.cantidad,
      row.costo_total,
      row.moneda,
      row.estado,
      row.pagos_parciales,
      row.porcentaje_pagado,
      now,
      now
    );

    return servicio;
  }

  async findById(id: string): Promise<Servicio | null> {
    const row = this.db.prepare('SELECT * FROM servicios WHERE id = ?').get(id) as ServicioRow | undefined;
    
    if (!row) {
      return null;
    }

    return ServicioMapper.toEntity(row);
  }

  async findByEventoId(eventoId: string): Promise<Servicio[]> {
    const rows = this.db.prepare('SELECT * FROM servicios WHERE evento_id = ? ORDER BY nombre').all(eventoId) as ServicioRow[];
    
    return rows.map(row => ServicioMapper.toEntity(row));
  }

  async findByProveedorId(proveedorId: string): Promise<Servicio[]> {
    const rows = this.db.prepare('SELECT * FROM servicios WHERE proveedor_id = ? ORDER BY nombre').all(proveedorId) as ServicioRow[];
    
    return rows.map(row => ServicioMapper.toEntity(row));
  }

  async update(servicio: Servicio): Promise<Servicio> {
    const row = ServicioMapper.toRow(servicio);
    const now = new Date().toISOString();

    this.db.prepare(`
      UPDATE servicios SET
        proveedor_id = ?,
        nombre = ?,
        descripcion = ?,
        costo_unitario = ?,
        cantidad = ?,
        costo_total = ?,
        moneda = ?,
        estado = ?,
        pagos_parciales = ?,
        porcentaje_pagado = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      row.proveedor_id,
      row.nombre,
      row.descripcion,
      row.costo_unitario,
      row.cantidad,
      row.costo_total,
      row.moneda,
      row.estado,
      row.pagos_parciales,
      row.porcentaje_pagado,
      now,
      servicio.id
    );

    return servicio;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM servicios WHERE id = ?').run(id);
  }

  async exists(id: string): Promise<boolean> {
    const result = this.db.prepare('SELECT 1 FROM servicios WHERE id = ?').get(id);
    return result !== undefined;
  }
}

