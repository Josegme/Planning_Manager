import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { Evento } from '../../../domain/entities/Evento';
import { UpdateEventoDTO } from '../../dto/UpdateEventoDTO';

export class UpdateEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(dto: UpdateEventoDTO): Promise<Evento> {
    const evento = await this.eventoRepository.findById(dto.id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    if (dto.nombre !== undefined && dto.nombre.trim().length === 0) {
      throw new Error('El nombre del evento no puede estar vacío');
    }

    if (dto.cantidadMesas !== undefined && dto.cantidadMesas <= 0) {
      throw new Error('La cantidad de mesas debe ser mayor a 0');
    }

    if (dto.capacidadMesa !== undefined && dto.capacidadMesa <= 0) {
      throw new Error('La capacidad por mesa debe ser mayor a 0');
    }

    evento.actualizar(
      dto.nombre?.trim(),
      dto.tipo?.trim() || null,
      dto.fecha,
      dto.hora?.trim() || null,
      dto.lugar?.trim() || null,
      dto.descripcion?.trim() || null,
      dto.cantidadMesas,
      dto.capacidadMesa
    );

    return await this.eventoRepository.update(evento);
  }
}

