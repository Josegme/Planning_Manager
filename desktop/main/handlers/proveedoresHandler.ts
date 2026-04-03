import { ipcMain, dialog, app } from 'electron';
import * as path from 'path';
import { getDatabase } from '../database/connection';
import { ExcelParser } from '../core/infrastructure/external/ExcelParser';
import { SQLiteProveedorRepository } from '../core/infrastructure/database/repositories/SQLiteProveedorRepository';
import { CreateProveedorUseCase } from '../core/application/use-cases/proveedores/CreateProveedorUseCase';
import { UpdateProveedorUseCase } from '../core/application/use-cases/proveedores/UpdateProveedorUseCase';
import { DeleteProveedorUseCase } from '../core/application/use-cases/proveedores/DeleteProveedorUseCase';
import { GetAllProveedoresUseCase } from '../core/application/use-cases/proveedores/GetAllProveedoresUseCase';
import { CreateProveedorDTO } from '../core/application/dto/CreateProveedorDTO';
import { UpdateProveedorDTO } from '../core/application/dto/UpdateProveedorDTO';

let proveedorRepository: SQLiteProveedorRepository | null = null;
let createUseCase: CreateProveedorUseCase | null = null;
let updateUseCase: UpdateProveedorUseCase | null = null;
let deleteUseCase: DeleteProveedorUseCase | null = null;
let getAllUseCase: GetAllProveedoresUseCase | null = null;

export function initializeProveedoresHandlers() {
  const db = getDatabase();
  
  proveedorRepository = new SQLiteProveedorRepository(db);
  createUseCase = new CreateProveedorUseCase(proveedorRepository);
  updateUseCase = new UpdateProveedorUseCase(proveedorRepository);
  deleteUseCase = new DeleteProveedorUseCase(proveedorRepository);
  getAllUseCase = new GetAllProveedoresUseCase(proveedorRepository);

  // IPC Handlers
  ipcMain.handle('proveedores:create', async (_, dto: CreateProveedorDTO) => {
    try {
      const proveedor = await createUseCase!.execute(dto);
      return { success: true, data: proveedor };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('proveedores:update', async (_, dto: UpdateProveedorDTO) => {
    try {
      const proveedor = await updateUseCase!.execute(dto);
      return { success: true, data: proveedor };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('proveedores:delete', async (_, id: string) => {
    try {
      await deleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('proveedores:getAll', async () => {
    try {
      const proveedores = await getAllUseCase!.execute();
      return { success: true, data: proveedores };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('proveedores:exportExcel', async (_, proveedores: any[]) => {
    try {
      const hoy = new Date();
      const dd = String(hoy.getDate()).padStart(2, '0');
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const yyyy = hoy.getFullYear();
      const nombreArchivo = `Proveedores_${dd}-${mm}-${yyyy}.xlsx`;
      const result = await dialog.showSaveDialog({
        title: 'Exportar Proveedores a Excel',
        defaultPath: path.join(app.getPath('downloads'), nombreArchivo),
        filters: [
          { name: 'Excel', extensions: ['xlsx'] },
          { name: 'Todos los archivos', extensions: ['*'] },
        ],
      });
      if (result.canceled || !result.filePath) {
        return { success: false, error: 'Operación cancelada' };
      }
      ExcelParser.exportProveedores(result.filePath, proveedores);
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al exportar' };
    }
  });
}

