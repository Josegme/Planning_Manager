import { ITimelineRepository } from '../../../domain/repositories/ITimelineRepository';
import { TimelineEtapa } from '../../../domain/entities/TimelineEtapa';
import { UpdateTimelineEtapaDTO } from '../../dto/UpdateTimelineEtapaDTO';
import { EstadoTimelineEtapa } from '../../../domain/entities/TimelineEtapa';

export class UpdateTimelineEtapaUseCase {
  constructor(private timelineRepository: ITimelineRepository) {}

  async execute(dto: UpdateTimelineEtapaDTO): Promise<TimelineEtapa> {
    const etapa = await this.timelineRepository.findById(dto.id);
    
    if (!etapa) {
      throw new Error(`Etapa con ID ${dto.id} no encontrada`);
    }

    if (dto.nombre !== undefined) etapa.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) etapa.descripcion = dto.descripcion?.trim() || null;
    if (dto.horaPlanificada !== undefined) etapa.horaPlanificada = dto.horaPlanificada;
    if (dto.duracionEstimada !== undefined) etapa.duracionEstimada = dto.duracionEstimada;
    if (dto.estado !== undefined) etapa.estado = dto.estado as EstadoTimelineEtapa;
    if (dto.horaInicioReal !== undefined) etapa.horaInicioReal = dto.horaInicioReal;
    if (dto.horaFinReal !== undefined) etapa.horaFinReal = dto.horaFinReal;
    if (dto.retrasoMinutos !== undefined) etapa.retrasoMinutos = dto.retrasoMinutos;
    if (dto.orden !== undefined) etapa.orden = dto.orden;

    const validacion = etapa.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.timelineRepository.update(etapa);
  }
}

