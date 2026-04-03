import { Proveedor, CreateProveedorDTO, UpdateProveedorDTO } from '@shared/types/Proveedor';

export const proveedoresApi = {
  create: async (dto: CreateProveedorDTO): Promise<Proveedor> => {
    if (!window.electronAPI?.proveedores?.create) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.proveedores.create(dto);
  },

  update: async (dto: UpdateProveedorDTO): Promise<Proveedor> => {
    if (!window.electronAPI?.proveedores?.update) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.proveedores.update(dto);
  },

  delete: async (id: string): Promise<void> => {
    if (!window.electronAPI?.proveedores?.delete) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.proveedores.delete(id);
  },

  getAll: async (): Promise<Proveedor[]> => {
    if (!window.electronAPI?.proveedores?.getAll) {
      console.warn('Electron API no disponible, retornando array vacío');
      return [];
    }
    return await window.electronAPI.proveedores.getAll();
  },

  exportExcel: async (proveedores: Proveedor[]): Promise<string> => {
    if (!window.electronAPI?.proveedores?.exportExcel) {
      throw new Error('Electron API no disponible.');
    }
    return await window.electronAPI.proveedores.exportExcel(proveedores);
  },
};

