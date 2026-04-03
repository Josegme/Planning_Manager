import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';

export class DeleteServicioUseCase {
  constructor(private servicioRepository: IServicioRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.servicioRepository.exists(id);
    if (!existe) {
      throw new Error(`Servicio con ID ${id} no encontrado`);
    }

    await this.servicioRepository.delete(id);
  }
}

