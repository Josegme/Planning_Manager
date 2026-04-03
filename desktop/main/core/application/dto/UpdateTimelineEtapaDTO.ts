export interface UpdateTimelineEtapaDTO {
  id: string;
  nombre?: string;
  descripcion?: string | null;
  horaPlanificada?: string;
  duracionEstimada?: number | null;
  estado?: string;
  horaInicioReal?: Date | null;
  horaFinReal?: Date | null;
  retrasoMinutos?: number;
  orden?: number;
}

