import { ipcMain } from 'electron';
import { getDatabase } from '../database/connection';
import { SQLiteServicioRepository } from '../core/infrastructure/database/repositories/SQLiteServicioRepository';
import { CreateServicioUseCase } from '../core/application/use-cases/servicios/CreateServicioUseCase';
import { UpdateServicioUseCase } from '../core/application/use-cases/servicios/UpdateServicioUseCase';
import { DeleteServicioUseCase } from '../core/application/use-cases/servicios/DeleteServicioUseCase';
import { GetAllServiciosUseCase } from '../core/application/use-cases/servicios/GetAllServiciosUseCase';
import { CalcularEstadisticasFinancierasUseCase } from '../core/application/use-cases/servicios/CalcularEstadisticasFinancierasUseCase';
import { CreateServicioDTO } from '../core/application/dto/CreateServicioDTO';
import { UpdateServicioDTO } from '../core/application/dto/UpdateServicioDTO';

let servicioRepository: SQLiteServicioRepository | null = null;
let createUseCase: CreateServicioUseCase | null = null;
let updateUseCase: UpdateServicioUseCase | null = null;
let deleteUseCase: DeleteServicioUseCase | null = null;
let getAllUseCase: GetAllServiciosUseCase | null = null;
let estadisticasUseCase: CalcularEstadisticasFinancierasUseCase | null = null;

export function initializeServiciosHandlers() {
  const db = getDatabase();
  
  servicioRepository = new SQLiteServicioRepository(db);
  createUseCase = new CreateServicioUseCase(servicioRepository);
  updateUseCase = new UpdateServicioUseCase(servicioRepository);
  deleteUseCase = new DeleteServicioUseCase(servicioRepository);
  getAllUseCase = new GetAllServiciosUseCase(servicioRepository);
  estadisticasUseCase = new CalcularEstadisticasFinancierasUseCase(servicioRepository);

  // IPC Handlers
  ipcMain.handle('servicios:create', async (_, dto: CreateServicioDTO) => {
    try {
      const servicio = await createUseCase!.execute(dto);
      return { success: true, data: servicio };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('servicios:update', async (_, dto: UpdateServicioDTO) => {
    try {
      const servicio = await updateUseCase!.execute(dto);
      return { success: true, data: servicio };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('servicios:delete', async (_, id: string) => {
    try {
      await deleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('servicios:getAll', async (_, eventoId: string) => {
    try {
      const servicios = await getAllUseCase!.execute(eventoId);
      return { success: true, data: servicios };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('servicios:getEstadisticas', async (_, eventoId: string) => {
    try {
      const estadisticas = await estadisticasUseCase!.execute(eventoId);
      return { success: true, data: estadisticas };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });
}

