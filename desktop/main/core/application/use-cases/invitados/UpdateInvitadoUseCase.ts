import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado } from '../../../domain/entities/Invitado';
import { UpdateInvitadoDTO } from '../../dto/UpdateInvitadoDTO';

export class UpdateInvitadoUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(dto: UpdateInvitadoDTO): Promise<Invitado> {
    const invitado = await this.invitadoRepository.findById(dto.id);
    
    if (!invitado) {
      throw new Error(`Invitado con ID ${dto.id} no encontrado`);
    }

    // Validar DNI único si se cambia
    if (dto.dni && dto.dni !== invitado.dni) {
      const existente = await this.invitadoRepository.findByDNI(dto.dni, invitado.eventoId);
      if (existente && existente.id !== invitado.id) {
        throw new Error(`Ya existe un invitado con DNI ${dto.dni} en este evento`);
      }
    }

    // Validar email único si se cambia
    if (dto.email && dto.email !== invitado.email) {
      const existente = await this.invitadoRepository.findByEmail(dto.email, invitado.eventoId);
      if (existente && existente.id !== invitado.id) {
        throw new Error(`Ya existe un invitado con email ${dto.email} en este evento`);
      }
    }

    // Actualizar campos
    if (dto.dni !== undefined) invitado.dni = dto.dni;
    if (dto.nombre !== undefined) invitado.nombre = dto.nombre.trim();
    if (dto.apellido !== undefined) invitado.apellido = dto.apellido.trim();
    if (dto.email !== undefined) invitado.email = dto.email?.trim() || null;
    if (dto.telefono !== undefined) invitado.telefono = dto.telefono?.trim() || null;
    if (dto.grupo !== undefined) invitado.grupo = dto.grupo?.trim() || null;
    if (dto.menu !== undefined) invitado.menu = dto.menu?.trim() || null;
    if (dto.mesaId !== undefined) invitado.mesaId = dto.mesaId;
    if (dto.qrCode !== undefined) invitado.qrCode = dto.qrCode;
    if (dto.acompanantesEsperados !== undefined) invitado.acompanantesEsperados = dto.acompanantesEsperados;

    // Validar datos
    const validacion = invitado.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.invitadoRepository.update(invitado);
  }
}

