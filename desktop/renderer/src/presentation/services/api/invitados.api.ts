import { Invitado, CreateInvitadoDTO, UpdateInvitadoDTO, ImportInvitadosDTO, ImportResult } from '@shared/types/Invitado';

export const invitadosApi = {
  create: async (dto: CreateInvitadoDTO): Promise<Invitado> => {
    if (!window.electronAPI?.invitados?.create) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.create(dto);
  },

  update: async (dto: UpdateInvitadoDTO): Promise<Invitado> => {
    if (!window.electronAPI?.invitados?.update) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.update(dto);
  },

  delete: async (id: string): Promise<void> => {
    if (!window.electronAPI?.invitados?.delete) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.delete(id);
  },

  getById: async (id: string): Promise<Invitado> => {
    if (!window.electronAPI?.invitados?.getById) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.getById(id);
  },

  getAll: async (eventoId: string): Promise<Invitado[]> => {
    if (!window.electronAPI?.invitados?.getAll) {
      console.warn('Electron API no disponible, retornando array vacío');
      return [];
    }
    return await window.electronAPI.invitados.getAll(eventoId);
  },

  import: async (dto: ImportInvitadosDTO): Promise<ImportResult> => {
    if (!window.electronAPI?.invitados?.import) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return (await window.electronAPI.invitados.import(dto)) as ImportResult;
  },

  checkIn: async (id: string, acompanantesReales: number = 0): Promise<Invitado> => {
    if (!window.electronAPI?.invitados?.checkIn) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.checkIn(id, acompanantesReales);
  },

  generarQRImagen: async (codigoQR: string): Promise<string> => {
    if (!window.electronAPI?.invitados?.generarQRImagen) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.generarQRImagen(codigoQR);
  },

  exportarQRPNG: async (codigoQR: string, nombreInvitado: string): Promise<string> => {
    if (!window.electronAPI?.invitados?.exportarQRPNG) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.exportarQRPNG(codigoQR, nombreInvitado);
  },

  regenerarQR: async (id: string): Promise<Invitado> => {
    if (!window.electronAPI?.invitados?.regenerarQR) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.invitados.regenerarQR(id);
  },
};

