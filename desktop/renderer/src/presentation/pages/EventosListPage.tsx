import { useState } from 'react';
import { useEventos } from '../hooks/useEventos';
import { Evento, EstadoEvento } from '@shared/types/Evento';
import { EventosAPI, EventoEstadisticas } from '../services/api/eventos.api';
import { EventoWizard } from './EventoWizard';
import { EventoFormModal } from '../components/EventoFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import './EventosListPage.css';

interface EventosListPageProps {
  onSelectEvento?: (evento: Evento) => void;
  onViewDashboard?: (evento: Evento) => void;
}

export function EventosListPage({ onSelectEvento, onViewDashboard }: EventosListPageProps = {}) {
  const { eventos, hiddenEventos, loading, error, deleteEvento, softDeleteEvento, recoverEvento, changeEstado, loadEventos, loadHiddenEventos, updateEvento } = useEventos();
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; eventoId: string | null }>({
    show: false,
    eventoId: null,
  });
  const [ocultarConfirm, setOcultarConfirm] = useState<{ show: boolean; eventoId: string | null }>({
    show: false,
    eventoId: null,
  });
  const [activarConfirm, setActivarConfirm] = useState<{
    show: boolean;
    evento: Evento | null;
    stats: EventoEstadisticas | null;
  }>({ show: false, evento: null, stats: null });

  const eventosFiltrados = selectedEstado === 'all'
    ? eventos
    : eventos.filter(e => e.estado === selectedEstado);

  const ordenEstado = (e: Evento) =>
    e.estado === EstadoEvento.ACTIVO ? 0 : e.estado === EstadoEvento.PLANIFICACION ? 1 : 2;
  const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    const byEstado = ordenEstado(a) - ordenEstado(b);
    if (byEstado !== 0) return byEstado;
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return dateA - dateB;
  });

  const eventosPorEstado = {
    planificacion: eventos.filter(e => e.estado === EstadoEvento.PLANIFICACION),
    activo: eventos.filter(e => e.estado === EstadoEvento.ACTIVO),
    finalizado: eventos.filter(e => e.estado === EstadoEvento.FINALIZADO),
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, eventoId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.eventoId) {
      try {
        await deleteEvento(deleteConfirm.eventoId);
        setDeleteConfirm({ show: false, eventoId: null });
      } catch (err) {
        alert('Error al eliminar evento');
        setDeleteConfirm({ show: false, eventoId: null });
      }
    }
  };

  const handleOcultarConfirm = async () => {
    if (ocultarConfirm.eventoId) {
      try {
        await softDeleteEvento(ocultarConfirm.eventoId);
        setOcultarConfirm({ show: false, eventoId: null });
        loadHiddenEventos();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al ocultar evento');
        setOcultarConfirm({ show: false, eventoId: null });
      }
    }
  };

  const handleChangeEstado = async (id: string, nuevoEstado: EstadoEvento) => {
    try {
      await changeEstado(id, nuevoEstado);
    } catch (err) {
      alert('Error al cambiar estado del evento');
    }
  };

  const handleActivarClick = async (evento: Evento) => {
    try {
      const stats = await EventosAPI.getEstadisticas(evento.id);
      setActivarConfirm({ show: true, evento, stats });
    } catch (err) {
      setActivarConfirm({ show: true, evento, stats: null });
    }
  };

  const getActivarWarningMessage = (): string => {
    if (!activarConfirm.evento) return '';
    const evento = activarConfirm.evento;
    const stats = activarConfirm.stats;
    const parts: string[] = [];

    const now = new Date();
    const eventDate = new Date(evento.fecha);
    const eventTime = evento.hora ? evento.hora.trim() : null;
    if (eventTime) {
      const [h, m] = eventTime.split(':').map(Number);
      eventDate.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
    } else {
      eventDate.setHours(0, 0, 0, 0);
    }
    if (now < eventDate) {
      parts.push('No es la fecha ni la hora programada del evento.');
    }

    if (stats) {
      const totalInvitados = stats.invitados?.total ?? 0;
      const totalMesas = stats.mesas?.total ?? 0;
      if (totalInvitados === 0) {
        parts.push('No hay invitados cargados.');
      }
      if (evento.tieneMesas && totalMesas === 0) {
        parts.push('El total de mesas y capacidades programado no está completo.');
      } else if (evento.tieneMesas && totalInvitados === 0) {
        parts.push('El total de mesas y capacidades programado puede no estar completo.');
      }
    } else if (evento.tieneMesas) {
      parts.push('El total de mesas y capacidades programado puede no estar completo.');
    }

    if (parts.length === 0) return '¿Activar este evento?';
    return parts.join(' ') + ' ¿Está seguro de activar el evento de todos modos?';
  };

  const handleActivarConfirm = async () => {
    if (!activarConfirm.evento) return;
    try {
      await changeEstado(activarConfirm.evento.id, EstadoEvento.ACTIVO);
      setActivarConfirm({ show: false, evento: null, stats: null });
    } catch (err) {
      alert('Error al cambiar estado del evento');
      setActivarConfirm({ show: false, evento: null, stats: null });
    }
  };

  const getEstadoLabel = (estado: EstadoEvento): string => {
    const labels: Record<EstadoEvento, string> = {
      [EstadoEvento.PLANIFICACION]: 'Planificación',
      [EstadoEvento.ACTIVO]: 'Activo',
      [EstadoEvento.FINALIZADO]: 'Finalizado',
    };
    return labels[estado];
  };

  const getEstadoClass = (estado: EstadoEvento): string => {
    const classes: Record<EstadoEvento, string> = {
      [EstadoEvento.PLANIFICACION]: 'estado-planificacion',
      [EstadoEvento.ACTIVO]: 'estado-activo',
      [EstadoEvento.FINALIZADO]: 'estado-finalizado',
    };
    return classes[estado];
  };

  if (loading) {
    return <div className="loading">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (showWizard) {
    return (
      <EventoWizard
        onComplete={() => {
          setShowWizard(false);
          loadEventos(); // Recargar eventos después de crear
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="eventos-list-page">
      <div className="page-header">
        <h1>Gestión de Eventos</h1>
        <button className="btn-primary" onClick={() => setShowWizard(true)}>
          Nuevo Evento
        </button>
      </div>

      <div className="estadisticas">
        <div className="stat-card">
          <div className="stat-value">{eventosPorEstado.planificacion.length}</div>
          <div className="stat-label">En Planificación</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{eventosPorEstado.activo.length}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{eventosPorEstado.finalizado.length}</div>
          <div className="stat-label">Finalizados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{eventos.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      <div className="filtros">
        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className="filtro-estado"
        >
          <option value="all">Todos los estados</option>
          <option value={EstadoEvento.PLANIFICACION}>Planificación</option>
          <option value={EstadoEvento.ACTIVO}>Activo</option>
          <option value={EstadoEvento.FINALIZADO}>Finalizado</option>
        </select>
      </div>

      {error && (
        <div className="error" style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', margin: '20px' }}>
          <strong>❌ Error:</strong> {error}
          <br />
          <small>Si ves "Electron API no disponible", ejecuta: <code>npm run build:main</code> desde la carpeta desktop/</small>
        </div>
      )}

      <div className="eventos-grid">
        {eventosOrdenados.length === 0 ? (
          <div className="empty-state">
            <p>No hay eventos {selectedEstado !== 'all' ? `en estado "${getEstadoLabel(selectedEstado as EstadoEvento)}"` : ''}</p>
            {!error && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Crea tu primer evento con el botón "Nuevo Evento"
              </p>
            )}
          </div>
        ) : (
          eventosOrdenados.map(evento => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onDelete={handleDeleteClick}
              onOcultar={(id) => setOcultarConfirm({ show: true, eventoId: id })}
              onChangeEstado={handleChangeEstado}
              onActivarClick={handleActivarClick}
              onSelectEvento={onSelectEvento}
              onViewDashboard={onViewDashboard}
              onEdit={() => setEditingEvento(evento)}
              getEstadoLabel={getEstadoLabel}
              getEstadoClass={getEstadoClass}
            />
          ))
        )}
      </div>

      {editingEvento && (
        <EventoFormModal
          evento={editingEvento}
          onClose={() => setEditingEvento(null)}
          onSuccess={() => {
            setEditingEvento(null);
            loadEventos();
          }}
          updateEvento={updateEvento}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmModal
          title="Eliminar Evento"
          message="¿Eliminar este evento de forma definitiva? Se borrarán también sus invitados, mesas, timeline y servicios. Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false, eventoId: null })}
          variant="danger"
        />
      )}

      {ocultarConfirm.show && (
        <ConfirmModal
          title="Ocultar Evento"
          message="El evento desaparecerá del listado durante 15 días. Podrá recuperarlo desde la sección «Eventos ocultos». Pasados 15 días sin recuperar, se eliminará definitivamente."
          confirmText="Ocultar"
          cancelText="Cancelar"
          onConfirm={handleOcultarConfirm}
          onCancel={() => setOcultarConfirm({ show: false, eventoId: null })}
          variant="info"
        />
      )}

      {activarConfirm.show && activarConfirm.evento && (
        <ConfirmModal
          title="Activar evento"
          message={getActivarWarningMessage()}
          confirmText="Sí, activar"
          cancelText="Cancelar"
          onConfirm={handleActivarConfirm}
          onCancel={() => setActivarConfirm({ show: false, evento: null, stats: null })}
          variant="info"
        />
      )}

      {hiddenEventos.length > 0 && (
        <div className="eventos-ocultos-section">
          <h2>Eventos ocultos (recuperables hasta 15 días)</h2>
          <div className="eventos-grid eventos-ocultos-grid">
            {hiddenEventos.map(evento => (
              <div key={evento.id} className="evento-card evento-card-oculto">
                <div className="evento-header">
                  <h3>{evento.nombre}</h3>
                  <span className="estado-badge estado-oculto">Oculto</span>
                </div>
                <div className="evento-info">
                  <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString('es-AR')}</p>
                  {evento.deletedAt && (
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      Oculto el {new Date(evento.deletedAt).toLocaleDateString('es-AR')}
                    </p>
                  )}
                </div>
                <div className="evento-actions">
                  <button
                    className="btn-primary"
                    onClick={async () => {
                      try {
                        await recoverEvento(evento.id);
                        loadHiddenEventos();
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Error al recuperar');
                      }
                    }}
                  >
                    Recuperar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface EventoCardProps {
  evento: Evento;
  onDelete: (id: string) => void;
  onOcultar: (id: string) => void;
  onChangeEstado: (id: string, estado: EstadoEvento) => void;
  onActivarClick?: (evento: Evento) => void;
  onSelectEvento?: (evento: Evento) => void;
  onViewDashboard?: (evento: Evento) => void;
  onEdit: () => void;
  getEstadoLabel: (estado: EstadoEvento) => string;
  getEstadoClass: (estado: EstadoEvento) => string;
}

function EventoCard({ evento, onDelete, onOcultar, onChangeEstado, onActivarClick, onSelectEvento, onViewDashboard, onEdit, getEstadoLabel, getEstadoClass }: EventoCardProps) {
  const fecha = new Date(evento.fecha).toLocaleDateString('es-AR');

  return (
    <div className="evento-card">
      <div className="evento-header">
        <h3>{evento.nombre}</h3>
        <span className={`estado-badge ${getEstadoClass(evento.estado)}`}>
          {getEstadoLabel(evento.estado)}
        </span>
      </div>
      
      <div className="evento-info">
        <p><strong>Fecha:</strong> {fecha}</p>
        {evento.lugar && <p><strong>Lugar:</strong> {evento.lugar}</p>}
        {evento.tieneMesas && (
          <p><strong>Mesas:</strong> {evento.cantidadMesas} mesas ({evento.capacidadMesa} personas c/u)</p>
        )}
      </div>

      <div className="evento-actions">
        {onViewDashboard && (
          <button
            className="btn-primary"
            onClick={() => onViewDashboard(evento)}
          >
            📊 Dashboard
          </button>
        )}
        {onSelectEvento && (
          <button
            className="btn-secondary"
            onClick={() => onSelectEvento(evento)}
          >
            👥 Invitados
          </button>
        )}
        {evento.estado === EstadoEvento.PLANIFICACION && (
          <button
            className="btn-secondary"
            onClick={() => (onActivarClick ? onActivarClick(evento) : onChangeEstado(evento.id, EstadoEvento.ACTIVO))}
          >
            Activar
          </button>
        )}
        {evento.estado === EstadoEvento.ACTIVO && (
          <button
            className="btn-secondary"
            onClick={() => onChangeEstado(evento.id, EstadoEvento.FINALIZADO)}
          >
            Finalizar
          </button>
        )}
        <button className="btn-secondary" onClick={onEdit}>
          Editar
        </button>
        {evento.estado === EstadoEvento.ACTIVO && (
          <button
            className="btn-secondary"
            onClick={() => onOcultar(evento.id)}
            title="Ocultar del listado 15 días (recuperable)"
          >
            Ocultar
          </button>
        )}
        {(evento.estado === EstadoEvento.PLANIFICACION || evento.estado === EstadoEvento.FINALIZADO) && (
          <button
            className="btn-danger"
            onClick={() => onDelete(evento.id)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

