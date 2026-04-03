import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { Evento } from '../../../domain/entities/Evento';

export class GetHiddenEventosUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(): Promise<Evento[]> {
    return await this.eventoRepository.findHidden();
  }
}
