import { TimelineEtapa } from '../entities/TimelineEtapa';

export interface ITimelineRepository {
  create(etapa: TimelineEtapa): Promise<TimelineEtapa>;
  findById(id: string): Promise<TimelineEtapa | null>;
  findByEventoId(eventoId: string): Promise<TimelineEtapa[]>;
  update(etapa: TimelineEtapa): Promise<TimelineEtapa>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  updateOrden(etapas: { id: string; orden: number }[]): Promise<void>;
}

