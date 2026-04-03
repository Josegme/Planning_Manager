export interface CreateInvitadoDTO {
  eventoId: string;
  dni?: string | null;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  grupo?: string | null;
  menu?: string | null;
  mesaId?: string | null;
  acompanantesEsperados?: number;
}

