import { IEventoRepository } from '@core/domain/repositories/IEventoRepository';
import { Evento } from '@core/domain/entities/Evento';

export class GetEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    return evento;
  }
}

