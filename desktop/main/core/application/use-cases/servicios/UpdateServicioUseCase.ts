import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';
import { Servicio } from '../../../domain/entities/Servicio';
import { UpdateServicioDTO } from '../../dto/UpdateServicioDTO';
import { EstadoServicio } from '../../../domain/entities/Servicio';

export class UpdateServicioUseCase {
  constructor(private servicioRepository: IServicioRepository) {}

  async execute(dto: UpdateServicioDTO): Promise<Servicio> {
    const servicio = await this.servicioRepository.findById(dto.id);
    
    if (!servicio) {
      throw new Error(`Servicio con ID ${dto.id} no encontrado`);
    }

    if (dto.proveedorId !== undefined) servicio.proveedorId = dto.proveedorId;
    if (dto.nombre !== undefined) servicio.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) servicio.descripcion = dto.descripcion?.trim() || null;
    if (dto.costoUnitario !== undefined) {
      servicio.costoUnitario = dto.costoUnitario;
      servicio.calcularCostoTotal();
    }
    if (dto.cantidad !== undefined) {
      servicio.cantidad = dto.cantidad;
      servicio.calcularCostoTotal();
    }
    if (dto.moneda !== undefined) servicio.moneda = dto.moneda;
    if (dto.estado !== undefined) servicio.estado = dto.estado as EstadoServicio;
    if (dto.pagosParciales !== undefined) {
      servicio.pagosParciales = dto.pagosParciales;
      servicio.calcularPorcentajePagado();
    }

    const validacion = servicio.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.servicioRepository.update(servicio);
  }
}

