import { TimelineEtapa, EstadoTimelineEtapa } from '../../../domain/entities/TimelineEtapa';

export interface TimelineRow {
  id: string;
  evento_id: string;
  nombre: string;
  descripcion: string | null;
  hora_planificada: string;
  duracion_estimada: number | null;
  estado: string;
  hora_inicio_real: string | null;
  hora_fin_real: string | null;
  retraso_minutos: number;
  orden: number;
  created_at: string;
  updated_at: string;
}

export class TimelineMapper {
  static toEntity(row: TimelineRow): TimelineEtapa {
    return new TimelineEtapa(
      row.id,
      row.evento_id,
      row.nombre,
      row.descripcion,
      row.hora_planificada,
      row.duracion_estimada,
      row.estado as EstadoTimelineEtapa,
      row.hora_inicio_real ? new Date(row.hora_inicio_real) : null,
      row.hora_fin_real ? new Date(row.hora_fin_real) : null,
      row.retraso_minutos,
      row.orden,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  static toRow(etapa: TimelineEtapa): TimelineRow {
    return {
      id: etapa.id,
      evento_id: etapa.eventoId,
      nombre: etapa.nombre,
      descripcion: etapa.descripcion,
      hora_planificada: etapa.horaPlanificada,
      duracion_estimada: etapa.duracionEstimada,
      estado: etapa.estado,
      hora_inicio_real: etapa.horaInicioReal ? etapa.horaInicioReal.toISOString() : null,
      hora_fin_real: etapa.horaFinReal ? etapa.horaFinReal.toISOString() : null,
      retraso_minutos: etapa.retrasoMinutos,
      orden: etapa.orden,
      created_at: etapa.createdAt.toISOString(),
      updated_at: etapa.updatedAt.toISOString(),
    };
  }
}

