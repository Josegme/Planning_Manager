/**
 * Tipo global único para window.electronAPI (preload).
 * Evita conflictos TS2717 por declaraciones duplicadas en cada api.
 */
import type { CreateEventoDTO, UpdateEventoDTO } from './DTOs';
import type { Evento, EstadoEvento } from './Evento';
import type { Invitado, CreateInvitadoDTO, UpdateInvitadoDTO, ImportInvitadosDTO } from './Invitado';
import type { CreateTimelineEtapaDTO, UpdateTimelineEtapaDTO, TimelineEtapa } from './Timeline';
import type { Servicio, CreateServicioDTO, UpdateServicioDTO, EstadisticasFinancieras } from './Servicio';
import type { Proveedor, CreateProveedorDTO, UpdateProveedorDTO } from './Proveedor';

export interface ProximaEtapaInfo {
  nombre: string;
  horaPlanificada: string;
}

export interface ResumenFinancieroInfo {
  total: number;
  pagado: number;
  pendiente: number;
}

export interface ImportServicioRow {
  nombre: string;
  descripcion: string | null;
  proveedorNombre: string | null;
  costoUnitario: number;
  cantidad: number;
  moneda: string;
  estado: string | null;
}

export interface EventoEstadisticas {
  invitados: { total: number; checkIn: number; porcentajeAsistencia: number };
  mesas: { total: number; completas: number; parciales: number; vacias: number };
  proximaEtapa: ProximaEtapaInfo | null;
  resumenFinanciero: ResumenFinancieroInfo | null;
}

export interface Mesa {
  id: string;
  eventoId: string;
  numero: number;
  capacidad: number;
  ubicacion: string | null;
}

declare global {
  interface Window {
    electronAPI: {
      eventos: {
        create: (dto: CreateEventoDTO) => Promise<Evento>;
        update: (dto: UpdateEventoDTO) => Promise<Evento>;
        delete: (id: string) => Promise<void>;
        getById: (id: string) => Promise<Evento>;
        getAll: () => Promise<Evento[]>;
        changeEstado: (id: string, estado: EstadoEvento) => Promise<Evento>;
        getEstadisticas: (eventoId: string) => Promise<EventoEstadisticas>;
        softDelete: (id: string) => Promise<void>;
        recover: (id: string) => Promise<void>;
        getHidden: () => Promise<Evento[]>;
      };
      invitados: {
        create: (dto: CreateInvitadoDTO) => Promise<Invitado>;
        update: (dto: UpdateInvitadoDTO) => Promise<Invitado>;
        delete: (id: string) => Promise<void>;
        getById: (id: string) => Promise<Invitado>;
        getAll: (eventoId: string) => Promise<Invitado[]>;
        import: (dto: ImportInvitadosDTO) => Promise<{ exitosos: Invitado[]; errores: unknown[] }>;
        checkIn: (id: string, acompanantesReales: number) => Promise<Invitado>;
        generarQRImagen: (codigoQR: string) => Promise<string>;
        exportarQRPNG: (codigoQR: string, nombreInvitado: string) => Promise<string>;
        regenerarQR: (id: string) => Promise<Invitado>;
      };
      excel: {
        selectFile: () => Promise<string>;
        parseFile: (filePath: string, eventoId: string) => Promise<unknown>;
        generateTemplate: () => Promise<string>;
        exportInvitados: (eventoId: string, invitados: Invitado[], eventoNombre?: string) => Promise<string>;
        exportServicios: (eventoId: string, servicios: unknown[], eventoNombre?: string, proveedores?: unknown[]) => Promise<string>;
        parseFileServicios: (filePath: string, eventoId: string) => Promise<{ eventoId: string; filas: ImportServicioRow[] }>;
        generateTemplateServicios: () => Promise<string>;
      };
      mesas: {
        getByEvento: (eventoId: string) => Promise<Mesa[]>;
        createFromEvento: (eventoId: string, cantidadMesas: number, capacidadMesa: number) => Promise<Mesa[]>;
        update: (mesaId: string, capacidad: number, ubicacion: string | null) => Promise<Mesa>;
        delete: (mesaId: string) => Promise<void>;
      };
      timeline: {
        create: (dto: CreateTimelineEtapaDTO) => Promise<TimelineEtapa>;
        update: (dto: UpdateTimelineEtapaDTO) => Promise<TimelineEtapa>;
        delete: (id: string) => Promise<void>;
        getAll: (eventoId: string) => Promise<TimelineEtapa[]>;
        marcarCompletada: (id: string) => Promise<TimelineEtapa>;
        registrarTiempoReal: (id: string, horaInicio: string | null, horaFin: string | null) => Promise<TimelineEtapa>;
        reordenar: (etapas: { id: string; orden: number }[]) => Promise<void>;
      };
      servicios: {
        create: (dto: CreateServicioDTO) => Promise<Servicio>;
        update: (dto: UpdateServicioDTO) => Promise<Servicio>;
        delete: (id: string) => Promise<void>;
        getAll: (eventoId: string) => Promise<Servicio[]>;
        getEstadisticas: (eventoId: string) => Promise<EstadisticasFinancieras>;
      };
      proveedores: {
        create: (dto: CreateProveedorDTO) => Promise<Proveedor>;
        update: (dto: UpdateProveedorDTO) => Promise<Proveedor>;
        delete: (id: string) => Promise<void>;
        getAll: () => Promise<Proveedor[]>;
        exportExcel: (proveedores: Proveedor[]) => Promise<string>;
      };
      sync: {
        startServer: () => Promise<{ success: boolean; port: number; ip: string | null; error?: string }>;
        stopServer: () => Promise<{ success: boolean; error?: string }>;
        getServerStatus: () => Promise<{ isRunning: boolean; port: number; ip: string | null }>;
        getServerIP: () => Promise<string | null>;
        generateConnectionQR: () => Promise<{ qrDataURL: string; connectionUrl: string; ip: string; port: number }>;
        saveEventoCache: (payload: { eventoId: string; data: unknown }) => Promise<{ success: boolean }>;
        getEventoCache: (eventoId: string) => Promise<unknown | null>;
        addPendingCheckIn: (item: { invitadoId: string; acompanantesReales: number }) => Promise<{ success: boolean }>;
        getPendingCheckIns: () => Promise<Array<{ invitadoId: string; acompanantesReales: number; addedAt?: string }>>;
        clearPendingCheckIns: () => Promise<{ success: boolean }>;
      };
    };
  }
}

export {};
