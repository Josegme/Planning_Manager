import { ipcMain } from 'electron';
import { getDatabase } from '../database/connection';
import { SQLiteTimelineRepository } from '../core/infrastructure/database/repositories/SQLiteTimelineRepository';
import { CreateTimelineEtapaUseCase } from '../core/application/use-cases/timeline/CreateTimelineEtapaUseCase';
import { UpdateTimelineEtapaUseCase } from '../core/application/use-cases/timeline/UpdateTimelineEtapaUseCase';
import { DeleteTimelineEtapaUseCase } from '../core/application/use-cases/timeline/DeleteTimelineEtapaUseCase';
import { GetAllTimelineEtapasUseCase } from '../core/application/use-cases/timeline/GetAllTimelineEtapasUseCase';
import { MarcarCompletadaUseCase } from '../core/application/use-cases/timeline/MarcarCompletadaUseCase';
import { RegistrarTiempoRealUseCase } from '../core/application/use-cases/timeline/RegistrarTiempoRealUseCase';
import { ReordenarEtapasUseCase } from '../core/application/use-cases/timeline/ReordenarEtapasUseCase';
import { CreateTimelineEtapaDTO } from '../core/application/dto/CreateTimelineEtapaDTO';
import { UpdateTimelineEtapaDTO } from '../core/application/dto/UpdateTimelineEtapaDTO';

let timelineRepository: SQLiteTimelineRepository | null = null;
let createUseCase: CreateTimelineEtapaUseCase | null = null;
let updateUseCase: UpdateTimelineEtapaUseCase | null = null;
let deleteUseCase: DeleteTimelineEtapaUseCase | null = null;
let getAllUseCase: GetAllTimelineEtapasUseCase | null = null;
let marcarCompletadaUseCase: MarcarCompletadaUseCase | null = null;
let registrarTiempoRealUseCase: RegistrarTiempoRealUseCase | null = null;
let reordenarEtapasUseCase: ReordenarEtapasUseCase | null = null;

export function initializeTimelineHandlers() {
  const db = getDatabase();
  
  timelineRepository = new SQLiteTimelineRepository(db);
  createUseCase = new CreateTimelineEtapaUseCase(timelineRepository);
  updateUseCase = new UpdateTimelineEtapaUseCase(timelineRepository);
  deleteUseCase = new DeleteTimelineEtapaUseCase(timelineRepository);
  getAllUseCase = new GetAllTimelineEtapasUseCase(timelineRepository);
  marcarCompletadaUseCase = new MarcarCompletadaUseCase(timelineRepository);
  registrarTiempoRealUseCase = new RegistrarTiempoRealUseCase(timelineRepository);
  reordenarEtapasUseCase = new ReordenarEtapasUseCase(timelineRepository);

  // IPC Handlers
  ipcMain.handle('timeline:create', async (_, dto: CreateTimelineEtapaDTO) => {
    try {
      const etapa = await createUseCase!.execute(dto);
      return { success: true, data: etapa };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:update', async (_, dto: UpdateTimelineEtapaDTO) => {
    try {
      const etapa = await updateUseCase!.execute(dto);
      return { success: true, data: etapa };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:delete', async (_, id: string) => {
    try {
      await deleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:getAll', async (_, eventoId: string) => {
    try {
      const etapas = await getAllUseCase!.execute(eventoId);
      return { success: true, data: etapas };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:marcarCompletada', async (_, id: string) => {
    try {
      const etapa = await marcarCompletadaUseCase!.execute(id);
      return { success: true, data: etapa };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:registrarTiempoReal', async (_, id: string, horaInicio?: string, horaFin?: string) => {
    try {
      const inicio = horaInicio ? new Date(horaInicio) : undefined;
      const fin = horaFin ? new Date(horaFin) : undefined;
      const etapa = await registrarTiempoRealUseCase!.execute(id, inicio, fin);
      return { success: true, data: etapa };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('timeline:reordenar', async (_, etapas: { id: string; orden: number }[]) => {
    try {
      await reordenarEtapasUseCase!.execute(etapas);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });
}

