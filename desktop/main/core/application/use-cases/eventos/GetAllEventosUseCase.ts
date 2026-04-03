import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { Evento } from '../../../domain/entities/Evento';

export class GetAllEventosUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(): Promise<Evento[]> {
    return await this.eventoRepository.findAll();
  }
}

