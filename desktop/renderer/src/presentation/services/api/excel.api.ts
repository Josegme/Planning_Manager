import type { Invitado } from '@shared/types/Invitado';
import type { Servicio } from '@shared/types/Servicio';
import type { Proveedor } from '@shared/types/Proveedor';
import type { ImportServicioRow } from '@shared/types/electronAPI';

export const excelApi = {
  selectFile: async (): Promise<string> => {
    if (!window.electronAPI?.excel?.selectFile) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.selectFile();
  },

  parseFile: async (filePath: string, eventoId: string): Promise<unknown> => {
    if (!window.electronAPI?.excel?.parseFile) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.parseFile(filePath, eventoId);
  },

  generateTemplate: async (): Promise<string> => {
    if (!window.electronAPI?.excel?.generateTemplate) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.generateTemplate();
  },

  exportInvitados: async (eventoId: string, invitados: Invitado[], eventoNombre?: string): Promise<string> => {
    if (!window.electronAPI?.excel?.exportInvitados) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.exportInvitados(eventoId, invitados, eventoNombre);
  },

  exportServicios: async (eventoId: string, servicios: Servicio[], eventoNombre?: string, proveedores?: Proveedor[]): Promise<string> => {
    if (!window.electronAPI?.excel?.exportServicios) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.exportServicios(eventoId, servicios, eventoNombre, proveedores ?? []);
  },

  parseFileServicios: async (filePath: string, eventoId: string): Promise<{ eventoId: string; filas: ImportServicioRow[] }> => {
    if (!window.electronAPI?.excel?.parseFileServicios) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.parseFileServicios(filePath, eventoId);
  },

  generateTemplateServicios: async (): Promise<string> => {
    if (!window.electronAPI?.excel?.generateTemplateServicios) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.excel.generateTemplateServicios();
  },
};

