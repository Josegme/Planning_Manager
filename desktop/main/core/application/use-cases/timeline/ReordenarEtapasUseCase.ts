import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';

export class ReordenarEtapasUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(etapas: { id: string; orden: number }[]): Promise<void> {
    await this.timelineRepository.updateOrden(etapas);
  }
}

