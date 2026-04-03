import { Invitado, EstadoInvitado } from '../../../domain/entities/Invitado';

export interface InvitadoRow {
  id: string;
  evento_id: string;
  dni: string | null;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  grupo: string | null;
  menu: string | null;
  mesa_id: string | null;
  qr_code: string | null;
  estado: string;
  acompanantes_esperados: number;
  acompanantes_reales: number;
  checkin_at: string | null;
  created_at: string;
  updated_at: string;
}

export class InvitadoMapper {
  static toEntity(row: InvitadoRow): Invitado {
    return new Invitado(
      row.id,
      row.evento_id,
      row.dni,
      row.nombre,
      row.apellido,
      row.email,
      row.telefono,
      row.grupo,
      row.menu,
      row.mesa_id,
      row.qr_code,
      row.estado as EstadoInvitado,
      row.acompanantes_esperados,
      row.acompanantes_reales,
      row.checkin_at ? new Date(row.checkin_at) : null,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  static toRow(invitado: Invitado): Omit<InvitadoRow, 'created_at' | 'updated_at'> {
    return {
      id: invitado.id,
      evento_id: invitado.eventoId,
      dni: invitado.dni,
      nombre: invitado.nombre,
      apellido: invitado.apellido,
      email: invitado.email,
      telefono: invitado.telefono,
      grupo: invitado.grupo,
      menu: invitado.menu,
      mesa_id: invitado.mesaId,
      qr_code: invitado.qrCode,
      estado: invitado.estado,
      acompanantes_esperados: invitado.acompanantesEsperados,
      acompanantes_reales: invitado.acompanantesReales,
      checkin_at: invitado.checkinAt ? invitado.checkinAt.toISOString() : null,
    };
  }
}

