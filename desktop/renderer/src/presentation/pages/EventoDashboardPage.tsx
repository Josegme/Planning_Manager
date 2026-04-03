import { useState, useEffect } from 'react';
import { EventosAPI, EventoEstadisticas } from '../services/api/eventos.api';
import { Evento } from '@shared/types/Evento';
import './EventoDashboardPage.css';

interface EventoDashboardPageProps {
  eventoId: string;
  onBack?: () => void;
  onVerInvitados?: () => void;
  onVerMesas?: () => void;
}

export function EventoDashboardPage({ eventoId, onBack, onVerInvitados, onVerMesas }: EventoDashboardPageProps) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [estadisticas, setEstadisticas] = useState<EventoEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [eventoId]);

  // Polling: actualizar estadísticas cada 10s para ver check-ins en tiempo real (Plan Fase 4.3)
  useEffect(() => {
    if (!eventoId || !estadisticas) return;
    const interval = setInterval(async () => {
      try {
        const stats = await EventosAPI.getEstadisticas(eventoId);
        setEstadisticas(stats);
      } catch {
        // ignore
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [eventoId, estadisticas]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventoData, estadisticasData] = await Promise.all([
        EventosAPI.getById(eventoId),
        EventosAPI.getEstadisticas(eventoId),
      ]);
      setEvento(eventoData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  if (error || !evento || !estadisticas) {
    return (
      <div className="error">
        {error || 'Error al cargar el dashboard del evento'}
        {onBack && (
          <button className="btn-secondary" onClick={onBack} style={{ marginTop: '20px' }}>
            Volver
          </button>
        )}
      </div>
    );
  }

  const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const partesInfo = [fechaFormateada];
  if (evento.hora && evento.hora.trim()) partesInfo.push(evento.hora.trim());
  if (evento.lugar && evento.lugar.trim()) partesInfo.push(evento.lugar.trim());
  const lineaInfo = partesInfo.join(' · ');

  return (
    <div className="evento-dashboard-page">
      <div className="dashboard-header">
        {onBack && (
          <button className="btn-back" onClick={onBack}>
            ← Volver
          </button>
        )}
        <div>
          <h1>{evento.nombre}</h1>
          <p className="evento-info-line" title="Fecha, hora y lugar del evento">
            {lineaInfo}
          </p>
        </div>
        <button className="btn-refresh" onClick={loadData}>
          🔄 Actualizar
        </button>
      </div>

      {/* Estadísticas de Invitados */}
      <div className="stats-section">
        <h2>Invitados</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{estadisticas.invitados.total}</div>
              <div className="stat-label">Total de Invitados</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{estadisticas.invitados.checkIn}</div>
              <div className="stat-label">Check-in Realizados</div>
            </div>
          </div>
          <div className="stat-card primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{estadisticas.invitados.porcentajeAsistencia}%</div>
              <div className="stat-label">Porcentaje de Asistencia</div>
            </div>
          </div>
        </div>
        {estadisticas.invitados.total > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${estadisticas.invitados.porcentajeAsistencia}%` }}
            />
          </div>
        )}
      </div>

      {/* Estadísticas de Mesas */}
      {evento.tieneMesas && estadisticas.mesas.total > 0 && (
        <div className="stats-section">
          <h2>Mesas</h2>
          <div className="stats-grid">
            <div className="stat-card success">
              <div className="stat-icon">🟢</div>
              <div className="stat-content">
                <div className="stat-value">{estadisticas.mesas.completas}</div>
                <div className="stat-label">Completas</div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">🟡</div>
              <div className="stat-content">
                <div className="stat-value">{estadisticas.mesas.parciales}</div>
                <div className="stat-label">Parciales</div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">⚪</div>
              <div className="stat-content">
                <div className="stat-value">{estadisticas.mesas.vacias}</div>
                <div className="stat-label">Vacías</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🪑</div>
              <div className="stat-content">
                <div className="stat-value">{estadisticas.mesas.total}</div>
                <div className="stat-label">Total de Mesas</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próxima Etapa del Timeline */}
      {estadisticas.proximaEtapa && (
        <div className="stats-section">
          <h2>Timeline</h2>
          <div className="timeline-next">
            <div className="timeline-icon">⏰</div>
            <div className="timeline-content">
              <div className="timeline-title">Próxima Etapa</div>
              <div className="timeline-name">{estadisticas.proximaEtapa.nombre}</div>
              <div className="timeline-time">{estadisticas.proximaEtapa.horaPlanificada}</div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen Financiero */}
      {estadisticas.resumenFinanciero && (
        <div className="stats-section">
          <h2>Finanzas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">${estadisticas.resumenFinanciero.total.toLocaleString()}</div>
                <div className="stat-label">Total de Costos</div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">${estadisticas.resumenFinanciero.pagado.toLocaleString()}</div>
                <div className="stat-label">Pagado</div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">${estadisticas.resumenFinanciero.pendiente.toLocaleString()}</div>
                <div className="stat-label">Pendiente</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones Rápidas */}
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => onVerInvitados?.()}>
            👥 Ver Invitados
          </button>
          {evento.tieneMesas && (
            <button className="action-btn" onClick={() => onVerMesas?.()}>
              🪑 Ver Mesas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

