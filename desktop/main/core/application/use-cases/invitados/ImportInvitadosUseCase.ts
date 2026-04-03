import { IInvitadoRepository } from '../../../domain/repositories/IInvitadoRepository';
import { Invitado, EstadoInvitado } from '../../../domain/entities/Invitado';
import { ImportInvitadosDTO } from '../../dto/ImportInvitadosDTO';
import { v4 as uuidv4 } from 'uuid';

export interface ImportResult {
  exitosos: Invitado[];
  errores: Array<{ fila: number; datos: any; error: string }>;
}

export class ImportInvitadosUseCase {
  constructor(private invitadoRepository: IInvitadoRepository) {}

  async execute(dto: ImportInvitadosDTO): Promise<ImportResult> {
    const exitosos: Invitado[] = [];
    const errores: Array<{ fila: number; datos: any; error: string }> = [];

    for (let i = 0; i < dto.invitados.length; i++) {
      const datosInvitado = dto.invitados[i];
      const numeroFila = i + 2; // +2 porque fila 1 es header y empezamos desde 0

      try {
        // Validar datos básicos
        if (!datosInvitado.nombre || !datosInvitado.apellido) {
          errores.push({
            fila: numeroFila,
            datos: datosInvitado,
            error: 'Nombre y apellido son requeridos',
          });
          continue;
        }

        // Validar DNI único si se proporciona
        if (datosInvitado.dni) {
          const existente = await this.invitadoRepository.findByDNI(datosInvitado.dni, dto.eventoId);
          if (existente) {
            errores.push({
              fila: numeroFila,
              datos: datosInvitado,
              error: `DNI ${datosInvitado.dni} ya existe en este evento`,
            });
            continue;
          }
        }

        // Validar email único si se proporciona
        if (datosInvitado.email) {
          const existente = await this.invitadoRepository.findByEmail(datosInvitado.email, dto.eventoId);
          if (existente) {
            errores.push({
              fila: numeroFila,
              datos: datosInvitado,
              error: `Email ${datosInvitado.email} ya existe en este evento`,
            });
            continue;
          }
        }

        // Crear entidad
        const invitado = new Invitado(
          uuidv4(),
          dto.eventoId,
          datosInvitado.dni?.trim() || null,
          datosInvitado.nombre.trim(),
          datosInvitado.apellido.trim(),
          datosInvitado.email?.trim() || null,
          datosInvitado.telefono?.trim() || null,
          datosInvitado.grupo?.trim() || null,
          datosInvitado.menu?.trim() || null,
          null, // mesaId se asigna después
          null, // qrCode se genera después
          EstadoInvitado.PENDIENTE,
          datosInvitado.acompanantesEsperados || 0,
          0, // acompanantesReales
          null, // checkinAt
          new Date(),
          new Date()
        );

        // Validar datos
        const validacion = invitado.validar();
        if (!validacion.valido) {
          errores.push({
            fila: numeroFila,
            datos: datosInvitado,
            error: validacion.errores.join(', '),
          });
          continue;
        }

        // Generar QR code
        invitado.generarQRCode();

        // Guardar
        const invitadoCreado = await this.invitadoRepository.create(invitado);
        exitosos.push(invitadoCreado);
      } catch (error) {
        errores.push({
          fila: numeroFila,
          datos: datosInvitado,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    return { exitosos, errores };
  }
}

