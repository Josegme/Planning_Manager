import { IEventoRepository } from '@core/domain/repositories/IEventoRepository';
import { Evento, EstadoEvento } from '@core/domain/entities/Evento';

export class ChangeEstadoEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string, nuevoEstado: EstadoEvento): Promise<Evento> {
    // Buscar evento existente
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    // Validar transición de estado
    this.validarTransicionEstado(evento.estado, nuevoEstado);

    // Cambiar estado
    evento.cambiarEstado(nuevoEstado);

    // Persistir
    return await this.eventoRepository.update(evento);
  }

  private validarTransicionEstado(estadoActual: EstadoEvento, nuevoEstado: EstadoEvento): void {
    // Validar transiciones permitidas
    const transicionesPermitidas: Record<EstadoEvento, EstadoEvento[]> = {
      [EstadoEvento.PLANIFICACION]: [EstadoEvento.ACTIVO, EstadoEvento.FINALIZADO],
      [EstadoEvento.ACTIVO]: [EstadoEvento.FINALIZADO],
      [EstadoEvento.FINALIZADO]: [], // No se puede cambiar desde finalizado
    };

    const estadosPermitidos = transicionesPermitidas[estadoActual];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar el estado de "${estadoActual}" a "${nuevoEstado}"`
      );
    }
  }
}

