import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';

export class DeleteProveedorUseCase {
  constructor(private proveedorRepository: IProveedorRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.proveedorRepository.exists(id);
    if (!existe) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }

    await this.proveedorRepository.delete(id);
  }
}

