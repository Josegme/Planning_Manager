import { TimelineEtapa, CreateTimelineEtapaDTO, UpdateTimelineEtapaDTO } from '@shared/types/Timeline';

export const timelineApi = {
  create: async (dto: CreateTimelineEtapaDTO): Promise<TimelineEtapa> => {
    if (!window.electronAPI?.timeline?.create) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.create(dto);
  },

  update: async (dto: UpdateTimelineEtapaDTO): Promise<TimelineEtapa> => {
    if (!window.electronAPI?.timeline?.update) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.update(dto);
  },

  delete: async (id: string): Promise<void> => {
    if (!window.electronAPI?.timeline?.delete) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.delete(id);
  },

  getAll: async (eventoId: string): Promise<TimelineEtapa[]> => {
    if (!window.electronAPI?.timeline?.getAll) {
      console.warn('Electron API no disponible, retornando array vacío');
      return [];
    }
    return await window.electronAPI.timeline.getAll(eventoId);
  },

  marcarCompletada: async (id: string): Promise<TimelineEtapa> => {
    if (!window.electronAPI?.timeline?.marcarCompletada) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.marcarCompletada(id);
  },

  registrarTiempoReal: async (id: string, horaInicio?: Date, horaFin?: Date): Promise<TimelineEtapa> => {
    if (!window.electronAPI?.timeline?.registrarTiempoReal) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.registrarTiempoReal(
      id,
      horaInicio?.toISOString() ?? null,
      horaFin?.toISOString() ?? null
    );
  },

  reordenar: async (etapas: { id: string; orden: number }[]): Promise<void> => {
    if (!window.electronAPI?.timeline?.reordenar) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.timeline.reordenar(etapas);
  },
};

