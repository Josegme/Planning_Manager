import { IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { Evento, EstadoEvento } from '../../../domain/entities/Evento';

export class ChangeEstadoEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string, nuevoEstado: EstadoEvento): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    this.validarTransicionEstado(evento.estado, nuevoEstado);

    evento.cambiarEstado(nuevoEstado);

    return await this.eventoRepository.update(evento);
  }

  private validarTransicionEstado(estadoActual: EstadoEvento, nuevoEstado: EstadoEvento): void {
    const transicionesPermitidas: Record<EstadoEvento, EstadoEvento[]> = {
      [EstadoEvento.PLANIFICACION]: [EstadoEvento.ACTIVO, EstadoEvento.FINALIZADO],
      [EstadoEvento.ACTIVO]: [EstadoEvento.FINALIZADO],
      [EstadoEvento.FINALIZADO]: [],
    };

    const estadosPermitidos = transicionesPermitidas[estadoActual];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar el estado de "${estadoActual}" a "${nuevoEstado}"`
      );
    }
  }
}

