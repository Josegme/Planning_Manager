import Database from 'better-sqlite3';
import { Migration } from './migrationRunner';

export const migration_003_proveedores_servicio_que_presta: Migration = {
  version: '003_proveedores_servicio_que_presta',
  up: (db: Database.Database) => {
    db.exec(`
      ALTER TABLE proveedores ADD COLUMN servicio_que_presta TEXT NULL
    `);
  },
  down: (_db: Database.Database) => {},
};
