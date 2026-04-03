import { CreateEventoDTO, UpdateEventoDTO } from '@shared/types/DTOs';
import type { EventoEstadisticas } from '@shared/types/electronAPI';
import { Evento, EstadoEvento } from '@shared/types/Evento';

export type { EventoEstadisticas } from '@shared/types/electronAPI';

export class EventosAPI {
  private static checkElectronAPI(): void {
    if (typeof window === 'undefined' || !window.electronAPI) {
      const errorMsg = 'Electron API no disponible. La aplicación debe ejecutarse desde Electron, no desde el navegador. Ejecuta: cd desktop && npm run dev';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    if (!window.electronAPI.eventos) {
      const errorMsg = 'Electron API eventos no disponible. Verifica que preload.js esté cargado correctamente. Ejecuta: npm run build:main';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
  }

  static async create(dto: CreateEventoDTO): Promise<Evento> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.create(dto);
  }

  static async update(dto: UpdateEventoDTO): Promise<Evento> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.update(dto);
  }

  static async delete(id: string): Promise<void> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.delete(id);
  }

  static async getById(id: string): Promise<Evento> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.getById(id);
  }

  static async getAll(): Promise<Evento[]> {
    if (typeof window === 'undefined' || !window.electronAPI?.eventos?.getAll) {
      console.warn('⚠️ Electron API no disponible. Retornando array vacío.');
      return [];
    }
    return await window.electronAPI.eventos.getAll();
  }

  static async changeEstado(id: string, estado: EstadoEvento): Promise<Evento> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.changeEstado(id, estado);
  }

  static async getEstadisticas(eventoId: string): Promise<EventoEstadisticas> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.getEstadisticas(eventoId);
  }

  static async softDelete(id: string): Promise<void> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.softDelete(id);
  }

  static async recover(id: string): Promise<void> {
    this.checkElectronAPI();
    return await window.electronAPI.eventos.recover(id);
  }

  static async getHidden(): Promise<Evento[]> {
    if (typeof window === 'undefined' || !window.electronAPI?.eventos?.getHidden) {
      return [];
    }
    return await window.electronAPI.eventos.getHidden();
  }
}

