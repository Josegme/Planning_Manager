import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class RecoverEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<void> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    await this.eventoRepository.recover(id);
  }
}
