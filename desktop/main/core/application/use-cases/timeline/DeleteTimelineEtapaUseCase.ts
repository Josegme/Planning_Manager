import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';

export class DeleteTimelineEtapaUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.timelineRepository.exists(id);
    if (!existe) {
      throw new Error(`Etapa con ID ${id} no encontrada`);
    }

    await this.timelineRepository.delete(id);
  }
}

