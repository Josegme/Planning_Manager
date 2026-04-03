import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class DeleteEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<void> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    if (!evento.puedeEliminarse()) {
      throw new Error('Solo se pueden eliminar eventos en planificación');
    }

    await this.eventoRepository.delete(id);
  }
}

