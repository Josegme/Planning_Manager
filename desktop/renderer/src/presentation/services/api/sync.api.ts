export interface ServerStatus {
  isRunning: boolean;
  port: number;
  ip: string | null;
}

export interface ConnectionQR {
  qrDataURL: string;
  connectionUrl: string;
  ip: string;
  port: number;
}

export const syncApi = {
  startServer: async (): Promise<{ success: boolean; port: number; ip: string | null; error?: string }> => {
    if (!window.electronAPI?.sync?.startServer) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.sync.startServer();
  },

  stopServer: async (): Promise<{ success: boolean; error?: string }> => {
    if (!window.electronAPI?.sync?.stopServer) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.sync.stopServer();
  },

  getServerStatus: async (): Promise<ServerStatus> => {
    if (!window.electronAPI?.sync?.getServerStatus) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.sync.getServerStatus();
  },

  getServerIP: async (): Promise<string | null> => {
    if (!window.electronAPI?.sync?.getServerIP) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.sync.getServerIP();
  },

  generateConnectionQR: async (): Promise<ConnectionQR> => {
    if (!window.electronAPI?.sync?.generateConnectionQR) {
      throw new Error('Electron API no disponible. Asegúrate de que preload.js esté cargado.');
    }
    return await window.electronAPI.sync.generateConnectionQR();
  },

  saveEventoCache: async (eventoId: string, data: unknown): Promise<void> => {
    if (!window.electronAPI?.sync?.saveEventoCache) return;
    await window.electronAPI.sync.saveEventoCache({ eventoId, data });
  },

  getEventoCache: async (eventoId: string): Promise<unknown | null> => {
    if (!window.electronAPI?.sync?.getEventoCache) return null;
    return await window.electronAPI.sync.getEventoCache(eventoId);
  },

  addPendingCheckIn: async (item: { invitadoId: string; acompanantesReales: number }): Promise<void> => {
    if (!window.electronAPI?.sync?.addPendingCheckIn) return;
    await window.electronAPI.sync.addPendingCheckIn(item);
  },

  getPendingCheckIns: async (): Promise<Array<{ invitadoId: string; acompanantesReales: number; addedAt?: string }>> => {
    if (!window.electronAPI?.sync?.getPendingCheckIns) return [];
    return await window.electronAPI.sync.getPendingCheckIns();
  },

  clearPendingCheckIns: async (): Promise<void> => {
    if (!window.electronAPI?.sync?.clearPendingCheckIns) return;
    await window.electronAPI.sync.clearPendingCheckIns();
  },
};
