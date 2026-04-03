import { IServicioRepository } from '../../../domain/repositories/IServicioRepository';

export interface EstadisticasFinancieras {
  total: number;
  pagado: number;
  pendiente: number;
  porProveedor: { proveedorId: string | null; nombre: string; total: number; pagado: number }[];
}

export class CalcularEstadisticasFinancierasUseCase {
  constructor(private servicioRepository: IServicioRepository) {}

  async execute(eventoId: string): Promise<EstadisticasFinancieras> {
    const servicios = await this.servicioRepository.findByEventoId(eventoId);

    const total = servicios.reduce((sum, s) => sum + s.costoTotal, 0);
    const pagado = servicios.reduce((sum, s) => sum + s.pagosParciales, 0);
    const pendiente = total - pagado;

    // Agrupar por proveedor
    const porProveedorMap = new Map<string | null, { nombre: string; total: number; pagado: number }>();
    
    servicios.forEach(servicio => {
      const key = servicio.proveedorId || 'sin-proveedor';
      const nombre = servicio.proveedorId ? 'Proveedor' : 'Sin Proveedor'; // TODO: Obtener nombre real del proveedor
      
      if (!porProveedorMap.has(key)) {
        porProveedorMap.set(key, { nombre, total: 0, pagado: 0 });
      }
      
      const stats = porProveedorMap.get(key)!;
      stats.total += servicio.costoTotal;
      stats.pagado += servicio.pagosParciales;
    });

    const porProveedor = Array.from(porProveedorMap.entries()).map(([proveedorId, stats]) => ({
      proveedorId: proveedorId === 'sin-proveedor' ? null : proveedorId,
      nombre: stats.nombre,
      total: stats.total,
      pagado: stats.pagado,
    }));

    return {
      total,
      pagado,
      pendiente,
      porProveedor,
    };
  }
}

