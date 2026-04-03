import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa } from '../../../domain/entities/TimelineEtapa';

export class GetAllTimelineEtapasUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(eventoId: string): Promise<TimelineEtapa[]> {
    return await this.timelineRepository.findByEventoId(eventoId);
  }
}

