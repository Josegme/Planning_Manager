import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Proveedor } from '../../../domain/entities/Proveedor';
import { CreateProveedorDTO } from '../../dto/CreateProveedorDTO';
import { v4 as uuidv4 } from 'uuid';

export class CreateProveedorUseCase {
  constructor(private proveedorRepository: IProveedorRepository) {}

  async execute(dto: CreateProveedorDTO): Promise<Proveedor> {
    const proveedor = new Proveedor(
      uuidv4(),
      dto.nombre.trim(),
      dto.servicioQuePresta?.trim() || null,
      dto.contacto?.trim() || null,
      dto.email?.trim() || null,
      dto.telefono?.trim() || null,
      dto.direccion?.trim() || null,
      new Date(),
      new Date()
    );

    const validacion = proveedor.validar();
    if (!validacion.valido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }

    return await this.proveedorRepository.create(proveedor);
  }
}

