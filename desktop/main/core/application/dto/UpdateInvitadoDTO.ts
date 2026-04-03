export interface UpdateInvitadoDTO {
  id: string;
  dni?: string | null;
  nombre?: string;
  apellido?: string;
  email?: string | null;
  telefono?: string | null;
  grupo?: string | null;
  menu?: string | null;
  mesaId?: string | null;
  qrCode?: string | null;
  acompanantesEsperados?: number;
}

