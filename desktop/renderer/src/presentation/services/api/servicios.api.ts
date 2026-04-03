import { Servicio, CreateServicioDTO, UpdateServicioDTO, EstadisticasFinancieras } from '@shared/types/Servicio';

export const serviciosApi = {
  create: async (dto: CreateServicioDTO): Promise<Servicio> => {
    if (!window.electronAPI?.servicios?.create) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.servicios.create(dto);
  },

  update: async (dto: UpdateServicioDTO): Promise<Servicio> => {
    if (!window.electronAPI?.servicios?.update) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.servicios.update(dto);
  },

  delete: async (id: string): Promise<void> => {
    if (!window.electronAPI?.servicios?.delete) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.servicios.delete(id);
  },

  getAll: async (eventoId: string): Promise<Servicio[]> => {
    if (!window.electronAPI?.servicios?.getAll) {
      console.warn('Electron API no disponible, retornando array vacío');
      return [];
    }
    return await window.electronAPI.servicios.getAll(eventoId);
  },

  getEstadisticas: async (eventoId: string): Promise<EstadisticasFinancieras> => {
    if (!window.electronAPI?.servicios?.getEstadisticas) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.servicios.getEstadisticas(eventoId);
  },
};

