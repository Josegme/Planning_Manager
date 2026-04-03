import type { Mesa } from '@shared/types/electronAPI';

export type { Mesa };

export const mesasApi = {
  getByEvento: async (eventoId: string): Promise<Mesa[]> => {
    if (!window.electronAPI?.mesas?.getByEvento) {
      console.warn('Electron API no disponible, retornando array vacío');
      return [];
    }
    return await window.electronAPI.mesas.getByEvento(eventoId);
  },

  createFromEvento: async (eventoId: string, cantidadMesas: number, capacidadMesa: number): Promise<Mesa[]> => {
    if (!window.electronAPI?.mesas?.createFromEvento) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.mesas.createFromEvento(eventoId, cantidadMesas, capacidadMesa);
  },

  update: async (mesaId: string, capacidad: number, ubicacion: string | null): Promise<Mesa> => {
    if (!window.electronAPI?.mesas?.update) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.mesas.update(mesaId, capacidad, ubicacion);
  },

  delete: async (mesaId: string): Promise<void> => {
    if (!window.electronAPI?.mesas?.delete) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.mesas.delete(mesaId);
  },
};

