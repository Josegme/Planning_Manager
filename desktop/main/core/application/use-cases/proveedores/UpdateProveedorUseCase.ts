import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Proveedor } from '../../../domain/entities/Proveedor';
import { UpdateProveedorDTO } from '../../dto/UpdateProveedorDTO';

export class UpdateProveedorUseCase {
  constructor(private proveedorRepository: IProveedorRepository) {}

  async execute(dto: UpdateProveedorDTO): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findById(dto.id);
    
    if (!proveedor) {
      throw new Error(`Proveedor con ID ${dto.id} no encontrado`);
    }

    if (dto.nombre !== undefined) proveedor.nombre = dto.nombre.trim();
    if (dto.servicioQuePresta !== undefined) proveedor.servicioQuePresta = dto.servicioQuePresta?.trim() || null;
    if (dto.contacto !== undefined) proveedor.contacto = dto.contacto?.trim() || null;
    if (dto.email !== undefined) proveedor.email = dto.email?.trim() || null;
    if (dto.telefono !== undefined) proveedor.telefono = dto.telefono?.trim() || null;
    if (dto.direccion !== undefined) proveedor.direccion = dto.direccion?.trim() || null;

    const validacion = proveedor.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.proveedorRepository.update(proveedor);
  }
}

