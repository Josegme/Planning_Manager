import { TimelineEtapa } from '@shared/types/Timeline';
import './TimelineBar.css';

interface TimelineBarProps {
  etapas: TimelineEtapa[];
}

function formatDuracionTotal(minutos: number): string {
  if (minutos <= 0) return '0 min';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
}

export function TimelineBar({ etapas }: TimelineBarProps) {
  const totalEtapas = etapas.length;
  const etapasCompletadas = etapas.filter(e => e.estado === 'completado').length;
  const porcentaje = totalEtapas > 0 ? Math.round((etapasCompletadas / totalEtapas) * 100) : 0;

  const duracionTotalMin = etapas.reduce((acc, e) => acc + (e.duracionEstimada ?? 0), 0);

  return (
    <div className="timeline-bar-container">
      <div className="timeline-bar-header">
        <h3>Progreso del Evento</h3>
        <span className="timeline-percentage">{porcentaje}%</span>
      </div>
      <div className="timeline-bar">
        <div 
          className="timeline-progress" 
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <div className="timeline-stats">
        <span>{etapasCompletadas} de {totalEtapas} etapas completadas</span>
        {duracionTotalMin > 0 && (
          <span className="timeline-duracion-total">
            Duración total estimada: {formatDuracionTotal(duracionTotalMin)}
          </span>
        )}
      </div>
    </div>
  );
}

