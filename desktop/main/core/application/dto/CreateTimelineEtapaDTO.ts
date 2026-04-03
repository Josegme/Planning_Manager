export interface CreateTimelineEtapaDTO {
  eventoId: string;
  nombre: string;
  descripcion?: string | null;
  horaPlanificada: string; // Formato HH:mm
  duracionEstimada?: number | null; // En minutos
  orden: number;
}

