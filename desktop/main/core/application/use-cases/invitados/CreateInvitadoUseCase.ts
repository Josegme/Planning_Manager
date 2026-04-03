import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado, EstadoInvitado } from '../../../domain/entities/Invitado';
import { CreateInvitadoDTO } from '../../dto/CreateInvitadoDTO';
import { v4 as uuidv4 } from 'uuid';

export class CreateInvitadoUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(dto: CreateInvitadoDTO): Promise<Invitado> {
    // Validar DNI único si se proporciona
    if (dto.dni) {
      const existente = await this.invitadoRepository.findByDNI(dto.dni, dto.eventoId);
      if (existente) {
        throw new Error(`Ya existe un invitado con DNI ${dto.dni} en este evento`);
      }
    }

    // Validar email único si se proporciona
    if (dto.email) {
      const existente = await this.invitadoRepository.findByEmail(dto.email, dto.eventoId);
      if (existente) {
        throw new Error(`Ya existe un invitado con email ${dto.email} en este evento`);
      }
    }

    // Crear entidad
    const invitado = new Invitado(
      uuidv4(),
      dto.eventoId,
      dto.dni || null,
      dto.nombre.trim(),
      dto.apellido.trim(),
      dto.email?.trim() || null,
      dto.telefono?.trim() || null,
      dto.grupo?.trim() || null,
      dto.menu?.trim() || null,
      dto.mesaId || null,
      null, // qrCode se genera después
      EstadoInvitado.PENDIENTE,
      dto.acompanantesEsperados || 0,
      0, // acompanantesReales
      null, // checkinAt
      new Date(),
      new Date()
    );

    // Validar datos
    const validacion = invitado.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    // Generar QR code
    invitado.generarQRCode();

    // Guardar
    return await this.invitadoRepository.create(invitado);
  }
}

