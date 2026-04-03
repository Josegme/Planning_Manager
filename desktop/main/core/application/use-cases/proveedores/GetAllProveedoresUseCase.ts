import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Proveedor } from '../../../domain/entities/Proveedor';

export class GetAllProveedoresUseCase {
  constructor(private proveedorRepository: IProveedorRepository) {}

  async execute(): Promise<Proveedor[]> {
    return await this.proveedorRepository.findAll();
  }
}

