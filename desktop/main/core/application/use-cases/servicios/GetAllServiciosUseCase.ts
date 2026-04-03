import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';
import { Servicio } from '../../../domain/entities/Servicio';

export class GetAllServiciosUseCase {
  constructor(private servicioRepository: IServicioRepository) {}

  async execute(eventoId: string): Promise<Servicio[]> {
    return await this.servicioRepository.findByEventoId(eventoId);
  }
}

