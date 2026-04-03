import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa } from '../../../domain/entities/TimelineEtapa';

export class RegistrarTiempoRealUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(id: string, horaInicio?: Date, horaFin?: Date): Promise<TimelineEtapa> {
    const etapa = await this.timelineRepository.findById(id);
    
    if (!etapa) {
      throw new Error(`Etapa con ID ${id} no encontrada`);
    }

    if (horaInicio) {
      etapa.horaInicioReal = horaInicio;
      etapa.registrarInicio();
    }

    if (horaFin) {
      etapa.horaFinReal = horaFin;
      etapa.registrarFin();
    }

    return await this.timelineRepository.update(etapa);
  }
}

