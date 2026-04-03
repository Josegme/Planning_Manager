import { IEventoRepository } from '@core/domain/repositories/IEventoRepository';
import { Evento } from '@core/domain/entities/Evento';
import { CreateEventoDTO } from '../../dto/CreateEventoDTO';

export class CreateEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(dto: CreateEventoDTO): Promise<Evento> {
    // Validaciones básicas
    if (!dto.nombre || dto.nombre.trim().length === 0) {
      throw new Error('El nombre del evento es requerido');
    }

    if (!dto.fecha) {
      throw new Error('La fecha del evento es requerida');
    }

    if (dto.tieneMesas) {
      if (dto.cantidadMesas <= 0) {
        throw new Error('La cantidad de mesas debe ser mayor a 0');
      }
      if (dto.capacidadMesa <= 0) {
        throw new Error('La capacidad por mesa debe ser mayor a 0');
      }
    }

    // Crear entidad
    const evento = Evento.create(
      dto.nombre.trim(),
      dto.tipo?.trim() || null,
      dto.fecha,
      dto.hora?.trim() || null,
      dto.lugar?.trim() || null,
      dto.descripcion?.trim() || null,
      dto.tieneMesas,
      dto.cantidadMesas,
      dto.capacidadMesa
    );

    // Persistir
    return await this.eventoRepository.create(evento);
  }
}

