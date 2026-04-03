export interface ImportInvitadosDTO {
  eventoId: string;
  invitados: Array<{
    dni?: string | null;
    nombre: string;
    apellido: string;
    email?: string | null;
    telefono?: string | null;
    grupo?: string | null;
    menu?: string | null;
    acompanantesEsperados?: number;
  }>;
}

