import Database from 'better-sqlite3';
import { migration_001_initial_schema } from './001_initial_schema';
import { migration_002_eventos_deleted_at } from './002_eventos_deleted_at';
import { migration_003_proveedores_servicio_que_presta } from './003_proveedores_servicio_que_presta';

export interface Migration {
  version: string;
  up: (db: Database.Database) => void;
  down?: (db: Database.Database) => void;
}

const MIGRATIONS_TABLE = 'schema_migrations';

export async function runMigrations(db: Database.Database): Promise<void> {
  // Crear tabla de migraciones si no existe
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      version TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Obtener migraciones ya aplicadas
  const appliedMigrations = new Set(
    db.prepare(`SELECT version FROM ${MIGRATIONS_TABLE}`)
      .all()
      .map((row: any) => row.version)
  );

  // Ejecutar todas las migraciones en orden
  const migrations: Migration[] = [
    migration_001_initial_schema,
    migration_002_eventos_deleted_at,
    migration_003_proveedores_servicio_que_presta,
  ];

  for (const migration of migrations) {
    if (!appliedMigrations.has(migration.version)) {
      console.log(`Ejecutando migración: ${migration.version}`);
      
      try {
        db.transaction(() => {
          migration.up(db);
          
          // Registrar migración aplicada
          db.prepare(
            `INSERT INTO ${MIGRATIONS_TABLE} (version) VALUES (?)`
          ).run(migration.version);
        })();

        console.log(`Migración ${migration.version} aplicada exitosamente`);
      } catch (error) {
        console.error(`Error al aplicar migración ${migration.version}:`, error);
        throw error;
      }
    }
  }
}

