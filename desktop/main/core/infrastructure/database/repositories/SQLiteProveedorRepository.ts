import Database from 'better-sqlite3';
import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Proveedor } from '../../../domain/entities/Proveedor';
import { ProveedorMapper, ProveedorRow } from '../mappers/ProveedorMapper';

export class SQLiteProveedorRepository implements IProveedorRepository {
  constructor(private db: Database.Database) {}

  async create(proveedor: Proveedor): Promise<Proveedor> {
    const row = ProveedorMapper.toRow(proveedor);
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO proveedores (
        id, nombre, servicio_que_presta, contacto, email, telefono, direccion,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      row.id,
      row.nombre,
      row.servicio_que_presta,
      row.contacto,
      row.email,
      row.telefono,
      row.direccion,
      now,
      now
    );

    return proveedor;
  }

  async findById(id: string): Promise<Proveedor | null> {
    const row = this.db.prepare('SELECT * FROM proveedores WHERE id = ?').get(id) as ProveedorRow | undefined;
    
    if (!row) {
      return null;
    }

    return ProveedorMapper.toEntity(row);
  }

  async findAll(): Promise<Proveedor[]> {
    const rows = this.db.prepare('SELECT * FROM proveedores ORDER BY nombre').all() as ProveedorRow[];
    
    return rows.map(row => ProveedorMapper.toEntity(row));
  }

  async update(proveedor: Proveedor): Promise<Proveedor> {
    const row = ProveedorMapper.toRow(proveedor);
    const now = new Date().toISOString();

    this.db.prepare(`
      UPDATE proveedores SET
        nombre = ?,
        servicio_que_presta = ?,
        contacto = ?,
        email = ?,
        telefono = ?,
        direccion = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      row.nombre,
      row.servicio_que_presta,
      row.contacto,
      row.email,
      row.telefono,
      row.direccion,
      now,
      proveedor.id
    );

    return proveedor;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM proveedores WHERE id = ?').run(id);
  }

  async exists(id: string): Promise<boolean> {
    const result = this.db.prepare('SELECT 1 FROM proveedores WHERE id = ?').get(id);
    return result !== undefined;
  }
}

