import { useState, useEffect } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineEtapa, EstadoTimelineEtapa } from '@shared/types/Timeline';
import { Evento } from '@shared/types/Evento';
import { EventosAPI } from '../services/api/eventos.api';
import { TimelineEtapaFormModal } from '../components/TimelineEtapaFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { TimelineBar } from '../components/TimelineBar';
import { TimelineEtapaCard } from '../components/TimelineEtapaCard';
import './TimelinePage.css';

interface TimelinePageProps {
  eventoId: string;
  eventoNombre: string;
}

export function TimelinePage({ eventoId, eventoNombre }: TimelinePageProps) {
  const { etapas, loading, error, createEtapa, updateEtapa, deleteEtapa, marcarCompletada, registrarTiempoReal, reordenarEtapas } = useTimeline(eventoId);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<TimelineEtapa | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; etapaId: string | null }>({
    show: false,
    etapaId: null,
  });
  const [reloj, setReloj] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    EventosAPI.getById(eventoId).then((e) => { if (!cancelled) setEvento(e); }).catch(() => { if (!cancelled) setEvento(null); });
    return () => { cancelled = true; };
  }, [eventoId]);

  useEffect(() => {
    const id = setInterval(() => setReloj(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleCreate = () => {
    setEditingEtapa(null);
    setShowFormModal(true);
  };

  const handleEdit = (etapa: TimelineEtapa) => {
    setEditingEtapa(etapa);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, etapaId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.etapaId) {
      try {
        await deleteEtapa(deleteConfirm.etapaId);
        setDeleteConfirm({ show: false, etapaId: null });
      } catch (err) {
        console.error('Error al eliminar etapa:', err);
        setDeleteConfirm({ show: false, etapaId: null });
      }
    }
  };

  const handleMarcarCompletada = async (id: string) => {
    try {
      await marcarCompletada(id);
    } catch (err) {
      alert('Error al marcar como completada: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const handleRegistrarInicio = async (id: string) => {
    try {
      await registrarTiempoReal(id, new Date());
    } catch (err) {
      alert('Error al registrar inicio: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const handleRegistrarFin = async (id: string) => {
    try {
      await registrarTiempoReal(id, undefined, new Date());
    } catch (err) {
      alert('Error al registrar fin: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const handleMoveEtapa = async (etapaId: string, newIndex: number) => {
    const etapasOrdenadas = etapas.map((e, index) => ({
      id: e.id,
      orden: index === newIndex ? etapas.findIndex(et => et.id === etapaId) : 
             index === etapas.findIndex(et => et.id === etapaId) ? newIndex : index,
    }));
    await reordenarEtapas(etapasOrdenadas);
  };

  if (loading) {
    return <div className="loading">Cargando timeline...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const proximaEtapa = etapas.find(e => e.estado === EstadoTimelineEtapa.PENDIENTE) || 
                       etapas.find(e => e.estado === EstadoTimelineEtapa.EN_CURSO) || null;

  const etapaEnCurso = etapas.find(e => e.estado === EstadoTimelineEtapa.EN_CURSO) ?? null;
  const transcurridoDesdeInicio = etapaEnCurso?.horaInicioReal
    ? Math.floor((reloj.getTime() - new Date(etapaEnCurso.horaInicioReal).getTime()) / 60000)
    : null;

  const formatTranscurrido = (min: number) => {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
  };

  const fechaFormateada = evento ? new Date(evento.fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
  const partesInfo = evento ? [fechaFormateada] : [];
  if (evento?.hora?.trim()) partesInfo.push(evento.hora.trim());
  if (evento?.lugar?.trim()) partesInfo.push(evento.lugar.trim());
  const lineaInfoEvento = partesInfo.length > 0 ? partesInfo.join(' · ') : null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="timeline-page">
        <div className="page-header">
          <div>
            <h1>Timeline del Evento</h1>
            <p className="evento-nombre">{eventoNombre}</p>
            {lineaInfoEvento && (
              <p className="timeline-evento-info" title="Fecha, hora y lugar del evento">
                {lineaInfoEvento}
              </p>
            )}
          </div>
          <button className="btn-primary" onClick={handleCreate}>
            ➕ Nueva Etapa
          </button>
        </div>

        {/* Reloj en vivo cuando hay etapa en curso */}
        {(etapas.length > 0 && (etapaEnCurso || etapas.some(e => e.estado !== EstadoTimelineEtapa.PENDIENTE))) && (
          <div className="timeline-reloj-vivo">
            <span className="timeline-hora-actual" title="Hora actual">
              🕐 {reloj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            {etapaEnCurso && transcurridoDesdeInicio !== null && transcurridoDesdeInicio >= 0 && (
              <span className="timeline-transcurrido" title="Tiempo transcurrido desde inicio de esta etapa">
                Transcurrido: {formatTranscurrido(transcurridoDesdeInicio)}
              </span>
            )}
          </div>
        )}

        {/* Barra de progreso */}
        {etapas.length > 0 && (
          <TimelineBar etapas={etapas} />
        )}

        {/* Próxima etapa */}
        {proximaEtapa && (
          <div className="proxima-etapa-card">
            <h3>⏰ Próxima Etapa</h3>
            <div className="proxima-etapa-info">
              <strong>{proximaEtapa.nombre}</strong>
              <span>{proximaEtapa.horaPlanificada}</span>
            </div>
          </div>
        )}

        {/* Lista de etapas */}
        <div className="etapas-list">
          {etapas.length === 0 ? (
            <div className="empty-state">
              <p>No hay etapas configuradas para este evento</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Crea la primera etapa para comenzar
              </p>
            </div>
          ) : (
            etapas.map((etapa, index) => (
              <DroppableEtapaSlot
                key={etapa.id}
                index={index}
                onDrop={(draggedEtapa) => {
                  if (draggedEtapa.id !== etapa.id) {
                    handleMoveEtapa(draggedEtapa.id, index);
                  }
                }}
              >
                <TimelineEtapaCard
                  etapa={etapa}
                  onEdit={() => handleEdit(etapa)}
                  onDelete={() => handleDeleteClick(etapa.id)}
                  onMarcarCompletada={() => handleMarcarCompletada(etapa.id)}
                  onRegistrarInicio={() => handleRegistrarInicio(etapa.id)}
                  onRegistrarFin={() => handleRegistrarFin(etapa.id)}
                  onMove={(newOrden) => {
                    const nuevasEtapas = etapas.map(e => ({
                      id: e.id,
                      orden: e.id === etapa.id ? newOrden : e.orden,
                    }));
                    reordenarEtapas(nuevasEtapas);
                  }}
                />
              </DroppableEtapaSlot>
            ))
          )}
        </div>

        {/* Modal de formulario */}
        {showFormModal && (
          <TimelineEtapaFormModal
            eventoId={eventoId}
            etapa={editingEtapa}
            etapasExistentes={etapas}
            onClose={() => {
              setShowFormModal(false);
              setEditingEtapa(null);
            }}
            onSuccess={async () => {
              setShowFormModal(false);
              setEditingEtapa(null);
            }}
            createEtapa={createEtapa}
            updateEtapa={updateEtapa}
          />
        )}

        {deleteConfirm.show && (
          <ConfirmModal
            title="Eliminar Etapa"
            message="¿Está seguro de eliminar esta etapa? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteConfirm({ show: false, etapaId: null })}
            variant="danger"
          />
        )}
      </div>
    </DndProvider>
  );
}

interface DroppableEtapaSlotProps {
  index: number;
  onDrop: (etapa: TimelineEtapa) => void;
  children: React.ReactNode;
}

function DroppableEtapaSlot({ index: _index, onDrop, children }: DroppableEtapaSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'timeline-etapa',
    drop: (item: { etapa: TimelineEtapa }) => {
      onDrop(item.etapa);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        border: isOver ? '2px dashed #2196F3' : '2px solid transparent',
        borderRadius: '8px',
        padding: isOver ? '8px' : '0',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </div>
  );
}

