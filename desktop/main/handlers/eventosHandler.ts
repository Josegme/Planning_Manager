import { ipcMain } from 'electron';
import { getDatabase } from '../database/connection';
import { SQLiteEventoRepository } from '../core/infrastructure/database/repositories/SQLiteEventoRepository';
import { CreateEventoUseCase } from '../core/application/use-cases/eventos/CreateEventoUseCase';
import { UpdateEventoUseCase } from '../core/application/use-cases/eventos/UpdateEventoUseCase';
import { DeleteEventoUseCase } from '../core/application/use-cases/eventos/DeleteEventoUseCase';
import { GetEventoUseCase } from '../core/application/use-cases/eventos/GetEventoUseCase';
import { GetAllEventosUseCase } from '../core/application/use-cases/eventos/GetAllEventosUseCase';
import { ChangeEstadoEventoUseCase } from '../core/application/use-cases/eventos/ChangeEstadoEventoUseCase';
import { SoftDeleteEventoUseCase } from '../core/application/use-cases/eventos/SoftDeleteEventoUseCase';
import { RecoverEventoUseCase } from '../core/application/use-cases/eventos/RecoverEventoUseCase';
import { GetHiddenEventosUseCase } from '../core/application/use-cases/eventos/GetHiddenEventosUseCase';
import { CreateEventoDTO } from '../core/application/dto/CreateEventoDTO';
import { UpdateEventoDTO } from '../core/application/dto/UpdateEventoDTO';
import { EstadoEvento } from '../core/domain/entities/Evento';

let eventoRepository: SQLiteEventoRepository | null = null;
let createUseCase: CreateEventoUseCase | null = null;
let updateUseCase: UpdateEventoUseCase | null = null;
let deleteUseCase: DeleteEventoUseCase | null = null;
let getUseCase: GetEventoUseCase | null = null;
let getAllUseCase: GetAllEventosUseCase | null = null;
let changeEstadoUseCase: ChangeEstadoEventoUseCase | null = null;
let softDeleteUseCase: SoftDeleteEventoUseCase | null = null;
let recoverUseCase: RecoverEventoUseCase | null = null;
let getHiddenUseCase: GetHiddenEventosUseCase | null = null;

export function initializeEventosHandlers() {
  const db = getDatabase();
  
  eventoRepository = new SQLiteEventoRepository(db);
  createUseCase = new CreateEventoUseCase(eventoRepository);
  updateUseCase = new UpdateEventoUseCase(eventoRepository);
  deleteUseCase = new DeleteEventoUseCase(eventoRepository);
  getUseCase = new GetEventoUseCase(eventoRepository);
  getAllUseCase = new GetAllEventosUseCase(eventoRepository);
  changeEstadoUseCase = new ChangeEstadoEventoUseCase(eventoRepository);
  softDeleteUseCase = new SoftDeleteEventoUseCase(eventoRepository);
  recoverUseCase = new RecoverEventoUseCase(eventoRepository);
  getHiddenUseCase = new GetHiddenEventosUseCase(eventoRepository);

  // IPC Handlers
  ipcMain.handle('eventos:create', async (_, dto: CreateEventoDTO) => {
    try {
      console.log('IPC: eventos:create recibido', dto);
      const evento = await createUseCase!.execute(dto);
      console.log('IPC: evento creado exitosamente', evento.id);
      return { success: true, data: evento };
    } catch (error) {
      console.error('IPC: error al crear evento', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:update', async (_, dto: UpdateEventoDTO) => {
    try {
      const evento = await updateUseCase!.execute(dto);
      return { success: true, data: evento };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:delete', async (_, id: string) => {
    try {
      await deleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:getById', async (_, id: string) => {
    try {
      const evento = await getUseCase!.execute(id);
      return { success: true, data: evento };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:getAll', async () => {
    try {
      console.log('IPC: eventos:getAll recibido');
      const eventos = await getAllUseCase!.execute();
      console.log('IPC: eventos encontrados', eventos.length);
      return { success: true, data: eventos };
    } catch (error) {
      console.error('IPC: error al obtener eventos', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:changeEstado', async (_, id: string, estado: EstadoEvento) => {
    try {
      const evento = await changeEstadoUseCase!.execute(id, estado);
      return { success: true, data: evento };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:softDelete', async (_, id: string) => {
    try {
      await softDeleteUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:recover', async (_, id: string) => {
    try {
      await recoverUseCase!.execute(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  ipcMain.handle('eventos:getHidden', async () => {
    try {
      const eventos = await getHiddenUseCase!.execute();
      return { success: true, data: eventos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });

  // Obtener estadísticas del evento
  ipcMain.handle('eventos:getEstadisticas', async (_, eventoId: string) => {
    try {
      const db = getDatabase();
      
      // Estadísticas de invitados
      const totalInvitados = db.prepare('SELECT COUNT(*) as count FROM invitados WHERE evento_id = ?').get(eventoId) as { count: number };
      const invitadosCheckIn = db.prepare('SELECT COUNT(*) as count FROM invitados WHERE evento_id = ? AND estado = ?').get(eventoId, 'confirmado') as { count: number };
      const porcentajeAsistencia = totalInvitados.count > 0 
        ? Math.round((invitadosCheckIn.count / totalInvitados.count) * 100) 
        : 0;

      // Estadísticas de mesas
      const mesasRows = db.prepare('SELECT * FROM mesas WHERE evento_id = ?').all(eventoId) as any[];
      let mesasCompletas = 0;
      let mesasParciales = 0;
      let mesasVacias = 0;

      for (const mesa of mesasRows) {
        const invitadosEnMesa = db.prepare('SELECT COUNT(*) as count FROM invitados WHERE mesa_id = ?').get(mesa.id) as { count: number };
        const ocupacion = invitadosEnMesa.count;
        
        if (ocupacion === 0) {
          mesasVacias++;
        } else if (ocupacion >= mesa.capacidad) {
          mesasCompletas++;
        } else {
          mesasParciales++;
        }
      }

      // Próxima etapa del timeline (cuando esté implementado)
      const proximaEtapa = null; // TODO: Implementar cuando Timeline esté listo

      // Resumen financiero (cuando esté implementado)
      const resumenFinanciero = null; // TODO: Implementar cuando Servicios esté listo

      return {
        success: true,
        data: {
          invitados: {
            total: totalInvitados.count,
            checkIn: invitadosCheckIn.count,
            porcentajeAsistencia,
          },
          mesas: {
            total: mesasRows.length,
            completas: mesasCompletas,
            parciales: mesasParciales,
            vacias: mesasVacias,
          },
          proximaEtapa,
          resumenFinanciero,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  });
}

