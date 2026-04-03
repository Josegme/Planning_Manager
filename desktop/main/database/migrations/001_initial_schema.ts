import Database from 'better-sqlite3';
import { Migration } from './migrationRunner';

export const migration_001_initial_schema: Migration = {
  version: '001_initial_schema',
  up: (db: Database.Database) => {
    // Tabla de eventos
    db.exec(`
      CREATE TABLE IF NOT EXISTS eventos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        tipo TEXT,
        fecha TEXT NOT NULL,
        hora TEXT,
        lugar TEXT,
        descripcion TEXT,
        estado TEXT DEFAULT 'planificacion',
        tiene_mesas INTEGER DEFAULT 1,
        cantidad_mesas INTEGER DEFAULT 0,
        capacidad_mesa INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de invitados
    db.exec(`
      CREATE TABLE IF NOT EXISTS invitados (
        id TEXT PRIMARY KEY,
        evento_id TEXT NOT NULL,
        dni TEXT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT,
        telefono TEXT,
        grupo TEXT,
        menu TEXT,
        mesa_id TEXT,
        qr_code TEXT,
        estado TEXT DEFAULT 'pendiente',
        acompanantes_esperados INTEGER DEFAULT 0,
        acompanantes_reales INTEGER DEFAULT 0,
        checkin_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
        FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE SET NULL
      )
    `);

    // Tabla de mesas
    db.exec(`
      CREATE TABLE IF NOT EXISTS mesas (
        id TEXT PRIMARY KEY,
        evento_id TEXT NOT NULL,
        numero INTEGER NOT NULL,
        capacidad INTEGER NOT NULL,
        ubicacion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
        UNIQUE(evento_id, numero)
      )
    `);

    // Tabla de timeline etapas
    db.exec(`
      CREATE TABLE IF NOT EXISTS timeline_etapas (
        id TEXT PRIMARY KEY,
        evento_id TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        hora_planificada TEXT NOT NULL,
        duracion_estimada INTEGER,
        estado TEXT DEFAULT 'pendiente',
        hora_inicio_real DATETIME,
        hora_fin_real DATETIME,
        retraso_minutos INTEGER DEFAULT 0,
        orden INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
      )
    `);

    // Tabla de servicios
    db.exec(`
      CREATE TABLE IF NOT EXISTS servicios (
        id TEXT PRIMARY KEY,
        evento_id TEXT NOT NULL,
        proveedor_id TEXT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        costo_unitario REAL NOT NULL,
        cantidad INTEGER DEFAULT 1,
        costo_total REAL NOT NULL,
        moneda TEXT DEFAULT 'ARS',
        estado TEXT DEFAULT 'cotizado',
        pagos_parciales REAL DEFAULT 0,
        porcentaje_pagado REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
      )
    `);

    // Tabla de proveedores
    db.exec(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        contacto TEXT,
        email TEXT,
        telefono TEXT,
        direccion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para mejorar rendimiento
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_invitados_evento ON invitados(evento_id);
      CREATE INDEX IF NOT EXISTS idx_invitados_mesa ON invitados(mesa_id);
      CREATE INDEX IF NOT EXISTS idx_invitados_dni ON invitados(dni);
      CREATE INDEX IF NOT EXISTS idx_mesas_evento ON mesas(evento_id);
      CREATE INDEX IF NOT EXISTS idx_timeline_evento ON timeline_etapas(evento_id);
      CREATE INDEX IF NOT EXISTS idx_servicios_evento ON servicios(evento_id);
      CREATE INDEX IF NOT EXISTS idx_servicios_proveedor ON servicios(proveedor_id);
    `);
  },
  down: (db: Database.Database) => {
    db.exec(`
      DROP TABLE IF EXISTS servicios;
      DROP TABLE IF EXISTS proveedores;
      DROP TABLE IF EXISTS timeline_etapas;
      DROP TABLE IF EXISTS invitados;
      DROP TABLE IF EXISTS mesas;
      DROP TABLE IF EXISTS eventos;
    `);
  },
};

