import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa, EstadoTimelineEtapa } from '../../../domain/entities/TimelineEtapa';
import { CreateTimelineEtapaDTO } from '../../dto/CreateTimelineEtapaDTO';
import { v4 as uuidv4 } from 'uuid';

export class CreateTimelineEtapaUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(dto: CreateTimelineEtapaDTO): Promise<TimelineEtapa> {
    const etapa = new TimelineEtapa(
      uuidv4(),
      dto.eventoId,
      dto.nombre.trim(),
      dto.descripcion?.trim() || null,
      dto.horaPlanificada,
      dto.duracionEstimada || null,
      EstadoTimelineEtapa.PENDIENTE,
      null,
      null,
      0,
      dto.orden,
      new Date(),
      new Date()
    );

    const validacion = etapa.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.timelineRepository.create(etapa);
  }
}

