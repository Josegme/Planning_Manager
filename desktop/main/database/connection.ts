import Database from 'better-sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { runMigrations } from './migrations/migrationRunner';

let db: Database.Database | null = null;

export async function initializeDatabase(): Promise<void> {
  try {
    // Obtener ruta de datos de usuario
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'planning_manager.db');

    // Crear conexión a SQLite
    db = new Database(dbPath);

    // Configuraciones de SQLite
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging para mejor rendimiento
    db.pragma('foreign_keys = ON'); // Habilitar foreign keys

    console.log(`Base de datos inicializada en: ${dbPath}`);

    // Ejecutar migraciones
    await runMigrations(db);

    console.log('Base de datos lista para usar');
  } catch (error) {
    console.error('Error al inicializar base de datos:', error);
    throw error;
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llame a initializeDatabase() primero.');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Base de datos cerrada');
  }
}

