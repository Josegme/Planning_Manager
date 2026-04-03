import { ipcMain } from 'electron';
import { getDatabase } from '../database/connection';
import Database from 'better-sqlite3';

interface Mesa {
  id: string;
  eventoId: string;
  numero: number;
  capacidad: number;
  ubicacion: string | null;
}

export function initializeMesasHandlers() {
  const db = getDatabase();

  // Obtener mesas de un evento
  ipcMain.handle('mesas:getByEvento', async (_, eventoId: string) => {
    try {
      const rows = db.prepare('SELECT * FROM mesas WHERE evento_id = ? ORDER BY numero').all(eventoId) as any[];
      
      const mesas: Mesa[] = rows.map(row => ({
        id: row.id,
        eventoId: row.evento_id,
        numero: row.numero,
        capacidad: row.capacidad,
        ubicacion: row.ubicacion,
      }));

      return { success: true, data: mesas };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  // Crear mesas automáticamente basadas en la configuración del evento (o completar las que falten si se aumentó la cantidad)
  ipcMain.handle('mesas:createFromEvento', async (_, eventoId: string, cantidadMesas: number, capacidadMesa: number) => {
    try {
      const existingRows = db.prepare('SELECT * FROM mesas WHERE evento_id = ? ORDER BY numero').all(eventoId) as any[];
      const maxNumero = existingRows.length > 0
        ? Math.max(...existingRows.map((r: any) => r.numero))
        : 0;

      if (maxNumero >= cantidadMesas) {
        const mesas: Mesa[] = existingRows.map(row => ({
          id: row.id,
          eventoId: row.evento_id,
          numero: row.numero,
          capacidad: row.capacidad,
          ubicacion: row.ubicacion,
        }));
        return { success: true, data: mesas };
      }

      const insert = db.prepare(`
        INSERT INTO mesas (id, evento_id, numero, capacidad, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const transaction = db.transaction(() => {
        for (let i = maxNumero + 1; i <= cantidadMesas; i++) {
          const id = `mesa_${eventoId}_${i}_${Date.now()}`;
          insert.run(id, eventoId, i, capacidadMesa);
        }
      });

      transaction();

      const rows = db.prepare('SELECT * FROM mesas WHERE evento_id = ? ORDER BY numero').all(eventoId) as any[];
      const mesas: Mesa[] = rows.map(row => ({
        id: row.id,
        eventoId: row.evento_id,
        numero: row.numero,
        capacidad: row.capacidad,
        ubicacion: row.ubicacion,
      }));

      return { success: true, data: mesas };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  // Actualizar mesa
  ipcMain.handle('mesas:update', async (_, mesaId: string, capacidad: number, ubicacion: string | null) => {
    try {
      const now = new Date().toISOString();
      db.prepare(`
        UPDATE mesas 
        SET capacidad = ?, ubicacion = ?, updated_at = ?
        WHERE id = ?
      `).run(capacidad, ubicacion, now, mesaId);

      const row = db.prepare('SELECT * FROM mesas WHERE id = ?').get(mesaId) as any;
      if (!row) {
        return { success: false, error: 'Mesa no encontrada' };
      }

      const mesa: Mesa = {
        id: row.id,
        eventoId: row.evento_id,
        numero: row.numero,
        capacidad: row.capacidad,
        ubicacion: row.ubicacion,
      };

      return { success: true, data: mesa };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  // Eliminar mesa (solo si está vacía)
  ipcMain.handle('mesas:delete', async (_, mesaId: string) => {
    try {
      // Verificar si hay invitados asignados
      const invitadosCount = db.prepare('SELECT COUNT(*) as count FROM invitados WHERE mesa_id = ?').get(mesaId) as { count: number };
      if (invitadosCount.count > 0) {
        return { success: false, error: 'No se puede eliminar una mesa que tiene invitados asignados' };
      }

      db.prepare('DELETE FROM mesas WHERE id = ?').run(mesaId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });
}

