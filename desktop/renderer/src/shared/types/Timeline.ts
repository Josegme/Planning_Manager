export enum EstadoTimelineEtapa {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en_curso',
  COMPLETADO = 'completado',
}

export interface TimelineEtapa {
  id: string;
  eventoId: string;
  nombre: string;
  descripcion: string | null;
  horaPlanificada: string;
  duracionEstimada: number | null;
  estado: EstadoTimelineEtapa;
  horaInicioReal: Date | null;
  horaFinReal: Date | null;
  retrasoMinutos: number;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTimelineEtapaDTO {
  eventoId: string;
  nombre: string;
  descripcion?: string | null;
  horaPlanificada: string;
  duracionEstimada?: number | null;
  orden: number;
}

export interface UpdateTimelineEtapaDTO {
  id: string;
  nombre?: string;
  descripcion?: string | null;
  horaPlanificada?: string;
  duracionEstimada?: number | null;
  estado?: EstadoTimelineEtapa;
  horaInicioReal?: Date | null;
  horaFinReal?: Date | null;
  retrasoMinutos?: number;
  orden?: number;
}

