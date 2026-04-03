import { useState, useEffect } from 'react';
import { useEventos } from '../hooks/useEventos';
import { Evento, EstadoEvento } from '@shared/types/Evento';
import { EventosAPI } from '../services/api/eventos.api';
import type { EventoEstadisticas } from '../services/api/eventos.api';
import { SyncServerPanel } from '../components/SyncServerPanel';
import './DashboardOrganizador.css';

interface DashboardOrganizadorProps {
  onSelectEvento?: (evento: Evento) => void;
}

export function DashboardOrganizador({ onSelectEvento }: DashboardOrganizadorProps = {}) {
  const { eventos, loading, error } = useEventos();
  const [filtroEstado, setFiltroEstado] = useState<EstadoEvento | null>(null);

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Separar eventos por estado
  const eventosPorEstado = {
    planificacion: eventos.filter(e => e.estado === EstadoEvento.PLANIFICACION),
    activo: eventos.filter(e => e.estado === EstadoEvento.ACTIVO),
    finalizado: eventos.filter(e => e.estado === EstadoEvento.FINALIZADO),
  };

  // Calcular estadísticas
  const totalEventos = eventos.length;
  const eventosActivos = eventosPorEstado.activo.length;
  const eventosPlanificacion = eventosPorEstado.planificacion.length;
  const eventosFinalizados = eventosPorEstado.finalizado.length;

  const handleFilterClick = (estado: EstadoEvento | null) => {
    setFiltroEstado(prev => prev === estado ? null : estado);
  };

  const showSection = (estado: EstadoEvento) =>
    filtroEstado === null || filtroEstado === estado;

  return (
    <div className="dashboard-organizador">
      <div className="dashboard-header">
        <h1>Dashboard del Organizador</h1>
        <p className="subtitle">Vista general de todos tus eventos</p>
      </div>

      {/* Estadísticas Generales - 4 tarjetas en una línea, clic para filtrar */}
      <div className="estadisticas-generales">
        <button
          type="button"
          className={`stat-card primary ${filtroEstado === null ? 'active' : ''}`}
          onClick={() => handleFilterClick(null)}
        >
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{totalEventos}</div>
            <div className="stat-label">Total de Eventos</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card warning ${filtroEstado === EstadoEvento.PLANIFICACION ? 'active' : ''}`}
          onClick={() => handleFilterClick(EstadoEvento.PLANIFICACION)}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{eventosPlanificacion}</div>
            <div className="stat-label">En Planificación</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card success ${filtroEstado === EstadoEvento.ACTIVO ? 'active' : ''}`}
          onClick={() => handleFilterClick(EstadoEvento.ACTIVO)}
        >
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{eventosActivos}</div>
            <div className="stat-label">Activos</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card info ${filtroEstado === EstadoEvento.FINALIZADO ? 'active' : ''}`}
          onClick={() => handleFilterClick(EstadoEvento.FINALIZADO)}
        >
          <div className="stat-icon">🏁</div>
          <div className="stat-content">
            <div className="stat-value">{eventosFinalizados}</div>
            <div className="stat-label">Finalizados</div>
          </div>
        </button>
      </div>

      {/* Panel de Sincronización */}
      <SyncServerPanel />

      {/* Eventos por Estado - orden: Activos, Planificación, Finalizados; filtro por tarjeta */}
      <div className="eventos-por-estado">
        {/* Eventos Activos */}
        {showSection(EstadoEvento.ACTIVO) && eventosPorEstado.activo.length > 0 && (
          <EventosSection
            titulo="Eventos Activos"
            eventos={eventosPorEstado.activo}
            estado={EstadoEvento.ACTIVO}
            color="success"
            onSelectEvento={onSelectEvento}
          />
        )}

        {/* Eventos en Planificación */}
        {showSection(EstadoEvento.PLANIFICACION) && eventosPorEstado.planificacion.length > 0 && (
          <EventosSection
            titulo="Eventos en Planificación"
            eventos={eventosPorEstado.planificacion}
            estado={EstadoEvento.PLANIFICACION}
            color="warning"
            onSelectEvento={onSelectEvento}
          />
        )}

        {/* Eventos Finalizados */}
        {showSection(EstadoEvento.FINALIZADO) && eventosPorEstado.finalizado.length > 0 && (
          <EventosSection
            titulo="Eventos Finalizados"
            eventos={eventosPorEstado.finalizado}
            estado={EstadoEvento.FINALIZADO}
            color="info"
            onSelectEvento={onSelectEvento}
          />
        )}
      </div>

      {/* Mensaje si no hay eventos */}
      {totalEventos === 0 && (
        <div className="empty-dashboard">
          <div className="empty-icon">📋</div>
          <h2>No hay eventos registrados</h2>
          <p>Crea tu primer evento para comenzar</p>
        </div>
      )}
    </div>
  );
}

interface EventosSectionProps {
  titulo: string;
  eventos: Evento[];
  estado: EstadoEvento;
  color: 'success' | 'warning' | 'info';
  onSelectEvento?: (evento: Evento) => void;
}

function EventosSection({ titulo, eventos, estado: _estado, color, onSelectEvento }: EventosSectionProps) {
  return (
    <div className={`eventos-section eventos-section-${color}`}>
      <div className="section-header">
        <h2>{titulo}</h2>
        <span className="section-count">{eventos.length} evento{eventos.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="eventos-grid">
        {eventos.map(evento => (
          <EventoCardDashboard key={evento.id} evento={evento} estado={_estado} onSelectEvento={onSelectEvento} />
        ))}
      </div>
    </div>
  );
}

interface EventoCardDashboardProps {
  evento: Evento;
  estado?: EstadoEvento;
  onSelectEvento?: (evento: Evento) => void;
}

function EventoCardDashboard({ evento, estado, onSelectEvento }: EventoCardDashboardProps) {
  const [stats, setStats] = useState<EventoEstadisticas | null>(null);

  const fecha = new Date(evento.fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const capacidad = evento.tieneMesas
    ? evento.cantidadMesas * evento.capacidadMesa
    : null;

  useEffect(() => {
    if (estado !== EstadoEvento.ACTIVO) return;
    let cancelled = false;
    EventosAPI.getEstadisticas(evento.id)
      .then(s => { if (!cancelled) setStats(s); })
      .catch(() => { if (!cancelled) setStats(null); });
    return () => { cancelled = true; };
  }, [estado, evento.id]);

  const handleViewDetails = () => {
    if (onSelectEvento) {
      onSelectEvento(evento);
    }
  };

  const showInvitadosCounter = estado === EstadoEvento.ACTIVO;
  const checkIn = stats?.invitados?.checkIn ?? 0;
  const totalInvitados = stats?.invitados?.total ?? 0;

  return (
    <div className="evento-card-dashboard">
      <div className="card-header">
        <h3>{evento.nombre}</h3>
        {evento.tipo && <span className="evento-tipo">{evento.tipo}</span>}
      </div>

      <div className="card-body">
        <div className="card-info">
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-text">{fecha}</span>
          </div>
          {evento.hora && (
            <div className="info-item">
              <span className="info-icon">🕐</span>
              <span className="info-text">{evento.hora}</span>
            </div>
          )}
          {evento.lugar && (
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span className="info-text">{evento.lugar}</span>
            </div>
          )}
          {capacidad && (
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span className="info-text">
                {evento.cantidadMesas} mesas × {evento.capacidadMesa} = {capacidad} personas
              </span>
            </div>
          )}
          {showInvitadosCounter && (
            <div className="info-item invitados-counter">
              <span className="info-icon">✓</span>
              <span className="info-text">
                {capacidad != null
                  ? `${checkIn} llegados de ${capacidad} personas`
                  : `${checkIn} llegados${totalInvitados > 0 ? ` (${totalInvitados} invitados)` : ''}`}
              </span>
            </div>
          )}
          {!evento.tieneMesas && (
            <div className="info-item">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">Sin mesas asignadas</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-view" onClick={handleViewDetails}>Ver Detalles</button>
      </div>
    </div>
  );
}

