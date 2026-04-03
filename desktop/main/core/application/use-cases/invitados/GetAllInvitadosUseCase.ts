import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado } from '../../../domain/entities/Invitado';

export class GetAllInvitadosUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(eventoId: string): Promise<Invitado[]> {
    return await this.invitadoRepository.findByEventoId(eventoId);
  }
}

