import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { getDatabase } from '../database/connection';
import { SQLiteInvitadoRepository } from '../core/infrastructure/database/repositories/SQLiteInvitadoRepository';
import { CreateInvitadoUseCase } from '../core/application/use-cases/invitados/CreateInvitadoUseCase';
import { UpdateInvitadoUseCase } from '../core/application/use-cases/invitados/UpdateInvitadoUseCase';
import { DeleteInvitadoUseCase } from '../core/application/use-cases/invitados/DeleteInvitadoUseCase';
import { GetInvitadoUseCase } from '../core/application/use-cases/invitados/GetInvitadoUseCase';
import { GetAllInvitadosUseCase } from '../core/application/use-cases/invitados/GetAllInvitadosUseCase';
import { ImportInvitadosUseCase } from '../core/application/use-cases/invitados/ImportInvitadosUseCase';
import { CheckInInvitadoUseCase } from '../core/application/use-cases/invitados/CheckInInvitadoUseCase';
import { CreateInvitadoDTO } from '../core/application/dto/CreateInvitadoDTO';
import { UpdateInvitadoDTO } from '../core/application/dto/UpdateInvitadoDTO';
import { ImportInvitadosDTO } from '../core/application/dto/ImportInvitadosDTO';
import { QRCodeService } from '../core/infrastructure/external/QRCodeService';

let invitadoRepository: SQLiteInvitadoRepository | null = null;
let createUseCase: CreateInvitadoUseCase | null = null;
let updateUseCase: UpdateInvitadoUseCase | null = null;
let deleteUseCase: DeleteInvitadoUseCase | null = null;
let getUseCase: GetInvitadoUseCase | null = null;
let getAllUseCase: GetAllInvitadosUseCase | null = null;
let importUseCase: ImportInvitadosUseCase | null = null;
let checkInUseCase: CheckInInvitadoUseCase | null = null;

export function initializeInvitadosHandlers() {
  const db = getDatabase();
  
  invitadoRepository = new SQLiteInvitadoRepository(db);
  createUseCase = new CreateInvitadoUseCase(invitadoRepository);
  updateUseCase = new UpdateInvitadoUseCase(invitadoRepository);
  deleteUseCase = new DeleteInvitadoUseCase(invitadoRepository);
  getUseCase = new GetInvitadoUseCase(invitadoRepository);
  getAllUseCase = new GetAllInvitadosUseCase(invitadoRepository);
  importUseCase = new ImportInvitadosUseCase(invitadoRepository);
  checkInUseCase = new CheckInInvitadoUseCase(invitadoRepository);

  // IPC Handlers
  ipcMain.handle('invitados:create', async (_, dto: CreateInvitadoDTO) => {
    try {
      const invitado = await createUseCase!.execute(dto);
      return { success: true, data: invitado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:update', async (_, dto: UpdateInvitadoDTO) => {
    try {
      const invitado = await updateUseCase!.execute(dto);
      return { success: true, data: invitado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:delete', async (_, id: string) => {
    try {
      await deleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:getById', async (_, id: string) => {
    try {
      const invitado = await getUseCase!.execute(id);
      return { success: true, data: invitado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:getAll', async (_, eventoId: string) => {
    try {
      const invitados = await getAllUseCase!.execute(eventoId);
      return { success: true, data: invitados };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:import', async (_, dto: ImportInvitadosDTO) => {
    try {
      const result = await importUseCase!.execute(dto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('invitados:checkIn', async (_, id: string, acompanantesReales: number = 0) => {
    try {
      const invitado = await checkInUseCase!.execute(id, acompanantesReales);
      return { success: true, data: invitado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  // Generar imagen QR como Data URL (base64)
  ipcMain.handle('invitados:generarQRImagen', async (_, codigoQR: string) => {
    try {
      const dataURL = await QRCodeService.generarDataURL(codigoQR);
      return { success: true, data: dataURL };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al generar imagen QR' };
    }
  });

  // Exportar QR como PNG
  ipcMain.handle('invitados:exportarQRPNG', async (_, codigoQR: string, nombreInvitado: string) => {
    try {
      const result = await dialog.showSaveDialog({
        title: 'Guardar QR Code como PNG',
        defaultPath: path.join(require('electron').app.getPath('downloads'), `QR_${nombreInvitado.replace(/[^a-z0-9]/gi, '_')}.png`),
        filters: [
          { name: 'Imágenes PNG', extensions: ['png'] },
          { name: 'Todos los archivos', extensions: ['*'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: 'Operación cancelada' };
      }

      const buffer = await QRCodeService.generarImagenQR(codigoQR);
      fs.writeFileSync(result.filePath, buffer);

      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al exportar QR' };
    }
  });

  // Regenerar QR code de un invitado
  ipcMain.handle('invitados:regenerarQR', async (_, id: string) => {
    try {
      const invitado = await getUseCase!.execute(id);
      if (!invitado) {
        return { success: false, error: 'Invitado no encontrado' };
      }

      // Regenerar QR
      invitado.regenerarQRCode();

      // Actualizar en BD
      const updated = await updateUseCase!.execute({
        id: invitado.id,
        qrCode: invitado.qrCode,
      });

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al regenerar QR' };
    }
  });
}

