import { Servicio, EstadoServicio } from '../../../domain/entities/Servicio';

export interface ServicioRow {
  id: string;
  evento_id: string;
  proveedor_id: string | null;
  nombre: string;
  descripcion: string | null;
  costo_unitario: number;
  cantidad: number;
  costo_total: number;
  moneda: string;
  estado: string;
  pagos_parciales: number;
  porcentaje_pagado: number;
  created_at: string;
  updated_at: string;
}

export class ServicioMapper {
  static toEntity(row: ServicioRow): Servicio {
    return new Servicio(
      row.id,
      row.evento_id,
      row.proveedor_id,
      row.nombre,
      row.descripcion,
      row.costo_unitario,
      row.cantidad,
      row.costo_total,
      row.moneda,
      row.estado as EstadoServicio,
      row.pagos_parciales,
      row.porcentaje_pagado,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  static toRow(servicio: Servicio): ServicioRow {
    return {
      id: servicio.id,
      evento_id: servicio.eventoId,
      proveedor_id: servicio.proveedorId,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      costo_unitario: servicio.costoUnitario,
      cantidad: servicio.cantidad,
      costo_total: servicio.costoTotal,
      moneda: servicio.moneda,
      estado: servicio.estado,
      pagos_parciales: servicio.pagosParciales,
      porcentaje_pagado: servicio.porcentajePagado,
      created_at: servicio.createdAt.toISOString(),
      updated_at: servicio.updatedAt.toISOString(),
    };
  }
}

