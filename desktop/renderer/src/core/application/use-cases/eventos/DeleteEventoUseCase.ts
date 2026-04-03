import { IEventoRepository } from '@core/domain/repositories/IEventoRepository';

export class DeleteEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<void> {
    // Buscar evento existente
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    // Validar que se puede eliminar
    if (!evento.puedeEliminarse()) {
      throw new Error('Solo se pueden eliminar eventos en planificación');
    }

    // Eliminar
    await this.eventoRepository.delete(id);
  }
}

