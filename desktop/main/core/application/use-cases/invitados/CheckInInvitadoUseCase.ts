import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado, EstadoInvitado } from '../../../domain/entities/Invitado';

export class CheckInInvitadoUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(id: string, acompanantesReales: number = 0): Promise<Invitado> {
    const invitado = await this.invitadoRepository.findById(id);
    
    if (!invitado) {
      throw new Error(`Invitado con ID ${id} no encontrado`);
    }

    // Validar que el invitado no haya hecho check-in ya
    if (invitado.estado === EstadoInvitado.CONFIRMADO) {
      throw new Error('Este invitado ya realizó check-in');
    }

    // Validar que no esté cancelado
    if (invitado.estado === EstadoInvitado.CANCELADO) {
      throw new Error('No se puede hacer check-in de un invitado cancelado');
    }

    invitado.hacerCheckIn(acompanantesReales);
    return await this.invitadoRepository.update(invitado);
  }
}

