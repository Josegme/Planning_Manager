import Database from 'better-sqlite3';
import { Migration } from './migrationRunner';

export const migration_002_eventos_deleted_at: Migration = {
  version: '002_eventos_deleted_at',
  up: (db: Database.Database) => {
    db.exec(`
      ALTER TABLE eventos ADD COLUMN deleted_at INTEGER NULL
    `);
  },
  down: (_db: Database.Database) => {
    // SQLite no permite DROP COLUMN de forma simple; reversión no implementada
  },
};
