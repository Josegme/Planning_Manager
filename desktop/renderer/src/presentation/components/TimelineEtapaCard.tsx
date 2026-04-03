import { useDrag } from 'react-dnd';
import { TimelineEtapa, EstadoTimelineEtapa } from '@shared/types/Timeline';
import './TimelineEtapaCard.css';

interface TimelineEtapaCardProps {
  etapa: TimelineEtapa;
  onEdit: () => void;
  onDelete: () => void;
  onMarcarCompletada: () => void;
  onRegistrarInicio: () => void;
  onRegistrarFin: () => void;
  onMove: (newOrden: number) => void;
}

export function TimelineEtapaCard({
  etapa,
  onEdit,
  onDelete,
  onMarcarCompletada,
  onRegistrarInicio,
  onRegistrarFin,
  onMove: _onMove,
}: TimelineEtapaCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'timeline-etapa',
    item: { etapa },
    end: (_item, _monitor) => {
      // Lógica de reordenamiento se maneja en el componente padre
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getColorEstado = (): string => {
    if (etapa.estado === EstadoTimelineEtapa.COMPLETADO && etapa.retrasoMinutos === 0) {
      return '#4CAF50'; // Verde
    }
    if (etapa.retrasoMinutos > 0 && etapa.retrasoMinutos <= 15) {
      return '#FF9800'; // Amarillo
    }
    if (etapa.retrasoMinutos > 15) {
      return '#F44336'; // Rojo
    }
    return '#9E9E9E'; // Gris (pendiente)
  };

  const color = getColorEstado();

  return (
    <div
      ref={drag}
      className="timeline-etapa-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `4px solid ${color}`,
        cursor: 'move',
      }}
    >
      <div className="etapa-header">
        <div className="etapa-info">
          <h3>{etapa.nombre}</h3>
          <span className="etapa-orden">#{etapa.orden}</span>
        </div>
        <span
          className="estado-badge"
          style={{
            background: color,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {etapa.estado === EstadoTimelineEtapa.PENDIENTE ? 'PENDIENTE' :
           etapa.estado === EstadoTimelineEtapa.EN_CURSO ? 'EN CURSO' : 'COMPLETADO'}
        </span>
      </div>

      <div className="etapa-body">
        {etapa.descripcion && (
          <p className="etapa-descripcion">{etapa.descripcion}</p>
        )}
        <div className="etapa-tiempos">
          <div className="tiempo-item">
            <strong>Hora Planificada:</strong> {etapa.horaPlanificada}
          </div>
          {etapa.duracionEstimada && (
            <div className="tiempo-item">
              <strong>Duración Estimada:</strong> {etapa.duracionEstimada} minutos
            </div>
          )}
          {etapa.horaInicioReal && (
            <div className="tiempo-item">
              <strong>Inicio Real:</strong> {new Date(etapa.horaInicioReal).toLocaleTimeString('es-AR')}
            </div>
          )}
          {etapa.horaFinReal && (
            <div className="tiempo-item">
              <strong>Fin Real:</strong> {new Date(etapa.horaFinReal).toLocaleTimeString('es-AR')}
            </div>
          )}
          {etapa.retrasoMinutos > 0 && (
            <div className="tiempo-item retraso">
              <strong>Retraso:</strong> {etapa.retrasoMinutos} minutos
            </div>
          )}
        </div>
      </div>

      <div className="etapa-actions">
        {etapa.estado === EstadoTimelineEtapa.PENDIENTE && (
          <button className="btn-success" onClick={onRegistrarInicio}>
            ▶️ Iniciar
          </button>
        )}
        {etapa.estado === EstadoTimelineEtapa.EN_CURSO && (
          <>
            <button className="btn-success" onClick={onRegistrarFin}>
              ✅ Completar
            </button>
            <button className="btn-secondary" onClick={onMarcarCompletada}>
              ✓ Marcar Completada
            </button>
          </>
        )}
        {etapa.estado === EstadoTimelineEtapa.COMPLETADO && (
          <span className="completada-badge">✓ Completada</span>
        )}
        <button className="btn-secondary" onClick={onEdit}>
          ✏️ Editar
        </button>
        <button className="btn-danger" onClick={onDelete}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

