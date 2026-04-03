import { useState, useEffect } from 'react';
import { TimelineEtapa, CreateTimelineEtapaDTO, UpdateTimelineEtapaDTO } from '@shared/types/Timeline';
import './Modal.css';

interface TimelineEtapaFormModalProps {
  eventoId: string;
  etapa: TimelineEtapa | null;
  etapasExistentes?: TimelineEtapa[];
  onClose: () => void;
  onSuccess: () => void;
  createEtapa: (dto: CreateTimelineEtapaDTO) => Promise<TimelineEtapa>;
  updateEtapa: (dto: UpdateTimelineEtapaDTO) => Promise<TimelineEtapa>;
}

export function TimelineEtapaFormModal({
  eventoId,
  etapa,
  etapasExistentes = [],
  onClose,
  onSuccess,
  createEtapa,
  updateEtapa,
}: TimelineEtapaFormModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horaPlanificada, setHoraPlanificada] = useState('');
  const [duracionEstimada, setDuracionEstimada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (etapa) {
      setNombre(etapa.nombre);
      setDescripcion(etapa.descripcion || '');
      setHoraPlanificada(etapa.horaPlanificada);
      setDuracionEstimada(etapa.duracionEstimada);
    } else {
      // Obtener el siguiente orden
      // Esto se puede mejorar obteniendo el máximo orden de las etapas existentes
      setHoraPlanificada('09:00');
    }
  }, [etapa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (etapa) {
        await updateEtapa({
          id: etapa.id,
          nombre,
          descripcion: descripcion || null,
          horaPlanificada,
          duracionEstimada: duracionEstimada || null,
        });
      } else {
        // Obtener el siguiente orden
        const maxOrden = etapasExistentes.length > 0
          ? Math.max(...etapasExistentes.map(e => e.orden))
          : 0;
        const orden = maxOrden + 1;
        
        await createEtapa({
          eventoId,
          nombre,
          descripcion: descripcion || null,
          horaPlanificada,
          duracionEstimada: duracionEstimada || null,
          orden,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar etapa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{etapa ? 'Editar Etapa' : 'Nueva Etapa'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-message" style={{ marginBottom: '15px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Recepción de invitados"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Descripción opcional de la etapa"
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaPlanificada">Hora Planificada *</label>
              <input
                id="horaPlanificada"
                type="time"
                value={horaPlanificada}
                onChange={(e) => setHoraPlanificada(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duracionEstimada">Duración Estimada (minutos)</label>
              <input
                id="duracionEstimada"
                type="number"
                value={duracionEstimada || ''}
                onChange={(e) => setDuracionEstimada(e.target.value ? parseInt(e.target.value) : null)}
                min="0"
                placeholder="Ej: 30"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : etapa ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

