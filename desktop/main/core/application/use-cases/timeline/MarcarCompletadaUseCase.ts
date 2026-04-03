import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa } from '../../../domain/entities/TimelineEtapa';

export class MarcarCompletadaUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(id: string): Promise<TimelineEtapa> {
    const etapa = await this.timelineRepository.findById(id);
    
    if (!etapa) {
      throw new Error(`Etapa con ID ${id} no encontrada`);
    }

    etapa.marcarCompletada();
    return await this.timelineRepository.update(etapa);
  }
}

