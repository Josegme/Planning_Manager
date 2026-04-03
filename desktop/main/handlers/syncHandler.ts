import { ipcMain, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { startServer, stopServer, getServerStatus } from '../server/server';
import { getLocalIP } from '../server/utils/networkUtils';
import { QRCodeService } from '../core/infrastructure/external/QRCodeService';

const RECEPTION_DIR = 'PlanningManager';
const CACHE_FILE = 'reception_cache.json';
const PENDING_FILE = 'pending_checkins.json';

function getReceptionDir(): string {
  const userData = app.getPath('userData');
  const dir = path.join(userData, RECEPTION_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Inicializa los handlers IPC para sincronización
 */
export function initializeSyncHandlers() {
  // Iniciar servidor HTTP
  ipcMain.handle('sync:startServer', async () => {
    try {
      const result = await startServer();
      return result;
    } catch (error) {
      return {
        success: false,
        port: 8080,
        ip: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  });

  // Detener servidor HTTP
  ipcMain.handle('sync:stopServer', async () => {
    try {
      const result = await stopServer();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  });

  // Obtener estado del servidor
  ipcMain.handle('sync:getServerStatus', async () => {
    try {
      const status = getServerStatus();
      const ip = getLocalIP();
      return {
        success: true,
        data: {
          ...status,
          ip: ip || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  });

  // Obtener IP local
  ipcMain.handle('sync:getServerIP', async () => {
    try {
      const ip = getLocalIP();
      return {
        success: true,
        data: ip || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  });

  // Generar QR de conexión
  ipcMain.handle('sync:generateConnectionQR', async () => {
    try {
      const status = getServerStatus();
      const ip = getLocalIP();

      if (!status.isRunning) {
        return {
          success: false,
          error: 'El servidor no está corriendo',
        };
      }

      if (!ip) {
        return {
          success: false,
          error: 'No se pudo obtener la IP local',
        };
      }

      const connectionUrl = `http://${ip}:${status.port}`;
      const qrDataURL = await QRCodeService.generarDataURL(connectionUrl);

      return {
        success: true,
        data: {
          qrDataURL,
          connectionUrl,
          ip,
          port: status.port,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar QR',
      };
    }
  });

  // Guardar caché del evento (modo recepción offline)
  ipcMain.handle('sync:saveEventoCache', async (_event, { eventoId, data }: { eventoId: string; data: unknown }) => {
    try {
      const dir = getReceptionDir();
      const filePath = path.join(dir, CACHE_FILE);
      let cache: Record<string, unknown> = {};
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
          cache = JSON.parse(content);
        } catch {
          cache = {};
        }
      }
      cache[eventoId] = typeof data === 'object' && data !== null
        ? { ...(data as Record<string, unknown>), savedAt: new Date().toISOString() }
        : { savedAt: new Date().toISOString() };
      fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al guardar caché' };
    }
  });

  // Obtener caché del evento
  ipcMain.handle('sync:getEventoCache', async (_event, eventoId: string) => {
    try {
      const dir = getReceptionDir();
      const filePath = path.join(dir, CACHE_FILE);
      if (!fs.existsSync(filePath)) return { success: true, data: null };
      const content = fs.readFileSync(filePath, 'utf-8');
      const cache: Record<string, unknown> = JSON.parse(content);
      const data = cache[eventoId] as unknown;
      return { success: true, data: data ?? null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al leer caché', data: null };
    }
  });

  // Agregar check-in a la cola (offline)
  ipcMain.handle('sync:addPendingCheckIn', async (_event, item: { invitadoId: string; acompanantesReales: number }) => {
    try {
      const dir = getReceptionDir();
      const filePath = path.join(dir, PENDING_FILE);
      let list: Array<{ invitadoId: string; acompanantesReales: number; addedAt: string }> = [];
      if (fs.existsSync(filePath)) {
        try {
          list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch {
          list = [];
        }
      }
      list.push({ ...item, addedAt: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al guardar check-in pendiente' };
    }
  });

  // Obtener check-ins pendientes
  ipcMain.handle('sync:getPendingCheckIns', async () => {
    try {
      const dir = getReceptionDir();
      const filePath = path.join(dir, PENDING_FILE);
      if (!fs.existsSync(filePath)) return { success: true, data: [] };
      const list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return { success: true, data: Array.isArray(list) ? list : [] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error', data: [] };
    }
  });

  // Limpiar cola de check-ins pendientes
  ipcMain.handle('sync:clearPendingCheckIns', async () => {
    try {
      const dir = getReceptionDir();
      const filePath = path.join(dir, PENDING_FILE);
      if (fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error' };
    }
  });
}
