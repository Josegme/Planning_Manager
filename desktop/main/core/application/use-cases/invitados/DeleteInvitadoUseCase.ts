import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';

export class DeleteInvitadoUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.invitadoRepository.exists(id);
    
    if (!existe) {
      throw new Error(`Invitado con ID ${id} no encontrado`);
    }

    await this.invitadoRepository.delete(id);
  }
}

