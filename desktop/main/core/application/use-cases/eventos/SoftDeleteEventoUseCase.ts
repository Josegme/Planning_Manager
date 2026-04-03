import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { EstadoEvento } from '../../../domain/entities/Evento';

export class SoftDeleteEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<void> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    if (evento.estado !== EstadoEvento.ACTIVO) {
      throw new Error('Solo se puede ocultar un evento activo. Use eliminar para otros estados.');
    }

    await this.eventoRepository.softDelete(id);
  }
}
