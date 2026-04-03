import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';
import { Servicio, EstadoServicio } from '../../../domain/entities/Servicio';
import { CreateServicioDTO } from '../../dto/CreateServicioDTO';
import { v4 as uuidv4 } from 'uuid';

export class CreateServicioUseCase {
  constructor(private servicioRepository: IServicioRepository) {}

  async execute(dto: CreateServicioDTO): Promise<Servicio> {
    const cantidad = dto.cantidad || 1;
    const costoTotal = dto.costoUnitario * cantidad;

    const servicio = new Servicio(
      uuidv4(),
      dto.eventoId,
      dto.proveedorId || null,
      dto.nombre.trim(),
      dto.descripcion?.trim() || null,
      dto.costoUnitario,
      cantidad,
      costoTotal,
      dto.moneda || 'ARS',
      EstadoServicio.COTIZADO,
      0,
      0,
      new Date(),
      new Date()
    );

    const validacion = servicio.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.servicioRepository.create(servicio);
  }
}

