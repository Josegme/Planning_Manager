import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado } from '../../../domain/entities/Invitado';

export class GetInvitadoUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(id: string): Promise<Invitado> {
    const invitado = await this.invitadoRepository.findById(id);
    
    if (!invitado) {
      throw new Error(`Invitado con ID ${id} no encontrado`);
    }

    return invitado;
  }
}

