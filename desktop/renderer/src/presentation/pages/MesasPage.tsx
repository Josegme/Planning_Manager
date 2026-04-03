import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mesasApi, Mesa } from '../services/api/mesas.api';
import { invitadosApi } from '../services/api/invitados.api';
import { Invitado } from '@shared/types/Invitado';
import { DroppableMesa } from '../components/DroppableMesa';
import { DraggableInvitado } from '../components/DraggableInvitado';
import { ConfirmModal } from '../components/ConfirmModal';
import './MesasPage.css';

interface MesasPageProps {
  eventoId: string;
  eventoNombre: string;
}

export function MesasPage({ eventoId, eventoNombre }: MesasPageProps) {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; mesa: Mesa | null }>({
    show: false,
    mesa: null,
  });

  useEffect(() => {
    loadData();
  }, [eventoId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mesasData, invitadosData] = await Promise.all([
        mesasApi.getByEvento(eventoId),
        invitadosApi.getAll(eventoId),
      ]);
      setMesas(mesasData);
      setInvitados(invitadosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const getInvitadosPorMesa = (mesaId: string): Invitado[] => {
    return invitados.filter(inv => inv.mesaId === mesaId);
  };

  const getOcupacionMesa = (mesa: Mesa): { ocupados: number; total: number } => {
    const invitadosMesa = getInvitadosPorMesa(mesa.id);
    const ocupados = invitadosMesa.reduce((sum, inv) => sum + 1 + inv.acompanantesReales, 0);
    return { ocupados, total: mesa.capacidad };
  };

  const getEstadoMesa = (mesa: Mesa): 'completa' | 'parcial' | 'vacia' => {
    const { ocupados, total } = getOcupacionMesa(mesa);
    if (ocupados === 0) return 'vacia';
    if (ocupados >= total) return 'completa';
    return 'parcial';
  };

  const getColorMesa = (estado: 'completa' | 'parcial' | 'vacia'): string => {
    switch (estado) {
      case 'completa': return '#4caf50'; // Verde
      case 'parcial': return '#ffc107'; // Amarillo
      case 'vacia': return '#9e9e9e'; // Gris
    }
  };

  const handleDeleteMesaClick = (mesa: Mesa) => {
    const invitadosMesa = getInvitadosPorMesa(mesa.id);
    if (invitadosMesa.length > 0) {
      return; // No mostrar modal si tiene invitados
    }
    setDeleteConfirm({ show: true, mesa });
  };

  const handleDeleteMesaConfirm = async () => {
    if (deleteConfirm.mesa) {
      try {
        await mesasApi.delete(deleteConfirm.mesa.id);
        await loadData();
        setDeleteConfirm({ show: false, mesa: null });
      } catch (err) {
        console.error('Error al eliminar mesa:', err);
        setDeleteConfirm({ show: false, mesa: null });
      }
    }
  };

  const handleUpdateMesa = async (mesaId: string, capacidad: number, ubicacion: string | null) => {
    try {
      await mesasApi.update(mesaId, capacidad, ubicacion);
      setEditingMesa(null);
      await loadData();
    } catch (err) {
      alert('Error al actualizar mesa: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const handleDropInvitado = async (invitadoId: string, mesaId: string) => {
    try {
      const invitado = invitados.find(inv => inv.id === invitadoId);
      if (!invitado) return;

      await invitadosApi.update({ ...invitado, mesaId });
      await loadData();
    } catch (err) {
      alert('Error al asignar invitado a mesa: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const invitadosSinMesa = invitados.filter(inv => !inv.mesaId);

  if (loading) {
    return <div className="loading">Cargando mesas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (mesas.length === 0) {
    return (
      <div className="mesas-page">
        <div className="page-header">
          <h1>Gestión de Mesas</h1>
          <p className="evento-nombre">{eventoNombre}</p>
        </div>
        <div className="empty-state">
          <p>No hay mesas configuradas para este evento</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Las mesas se crean automáticamente al configurar el evento
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mesas-page">
        <div className="page-header">
          <h1>Gestión de Mesas</h1>
          <p className="evento-nombre">{eventoNombre}</p>
        </div>

        {/* Invitados sin mesa */}
        {invitadosSinMesa.length > 0 && (
          <div className="invitados-sin-mesa">
            <h2>Invitados sin Mesa ({invitadosSinMesa.length})</h2>
            <div className="invitados-sin-mesa-list">
              {invitadosSinMesa.map(invitado => (
                <DraggableInvitado key={invitado.id} invitado={invitado}>
                  <div className="invitado-sin-mesa-item">
                    <strong>{invitado.nombre} {invitado.apellido}</strong>
                    {invitado.dni && <span className="dni">DNI: {invitado.dni}</span>}
                  </div>
                </DraggableInvitado>
              ))}
            </div>
          </div>
        )}

        <div className="mesas-grid">
        {mesas.map(mesa => {
          const estado = getEstadoMesa(mesa);
          const { ocupados, total } = getOcupacionMesa(mesa);
          const invitadosMesa = getInvitadosPorMesa(mesa.id);
          const color = getColorMesa(estado);

          return (
            <DroppableMesa key={mesa.id} mesa={mesa} onDrop={handleDropInvitado}>
              <div
                className="mesa-card"
                style={{
                  border: `3px solid ${color}`,
                  background: estado === 'vacia' ? '#f5f5f5' : '#fff',
                }}
              >
                <div className="mesa-header">
                  <h3>Mesa {mesa.numero}</h3>
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
                    {estado === 'completa' ? 'COMPLETA' : estado === 'parcial' ? 'PARCIAL' : 'VACÍA'}
                  </span>
                </div>

                <div className="mesa-info">
                  <div className="ocupacion-info">
                    <strong>Ocupación:</strong> {ocupados} / {total} personas
                  </div>
                  {mesa.ubicacion && (
                    <div className="ubicacion-info">
                      <strong>Ubicación:</strong> {mesa.ubicacion}
                    </div>
                  )}
                  <div className="capacidad-info">
                    <strong>Capacidad:</strong> {mesa.capacidad} personas
                  </div>
                  {invitadosMesa.length > 0 && (
                    <div className="invitados-count">
                      <strong>Invitados asignados:</strong> {invitadosMesa.length}
                    </div>
                  )}
                  {invitadosMesa.length > 0 && (
                    <div className="invitados-list">
                      {invitadosMesa.map(inv => (
                        <div key={inv.id} className="invitado-en-mesa">
                          {inv.nombre} {inv.apellido}
                          {(inv.acompanantesEsperados ?? 0) > 0 && (
                            <span className="invitado-acompanantes"> (+{inv.acompanantesEsperados})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mesa-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedMesa(mesa)}
                    title="Ver detalles"
                  >
                    👁️ Ver Detalles
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setEditingMesa(mesa)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteMesaClick(mesa)}
                    title="Eliminar"
                    disabled={getInvitadosPorMesa(mesa.id).length > 0}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </DroppableMesa>
          );
        })}
      </div>

      {/* Modal de edición */}
      {editingMesa && (
        <MesaEditModal
          mesa={editingMesa}
          onClose={() => setEditingMesa(null)}
          onSave={handleUpdateMesa}
        />
      )}

      {/* Modal de detalles */}
      {selectedMesa && (
        <MesaDetailModal
          mesa={selectedMesa}
          invitados={getInvitadosPorMesa(selectedMesa.id)}
          onClose={() => setSelectedMesa(null)}
        />
      )}

      {deleteConfirm.show && deleteConfirm.mesa && (
        <ConfirmModal
          title="Eliminar Mesa"
          message={`¿Eliminar Mesa ${deleteConfirm.mesa.numero}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteMesaConfirm}
          onCancel={() => setDeleteConfirm({ show: false, mesa: null })}
          variant="danger"
        />
      )}
      </div>
    </DndProvider>
  );
}

interface MesaEditModalProps {
  mesa: Mesa;
  onClose: () => void;
  onSave: (mesaId: string, capacidad: number, ubicacion: string | null) => Promise<void>;
}

function MesaEditModal({ mesa, onClose, onSave }: MesaEditModalProps) {
  const [capacidad, setCapacidad] = useState(mesa.capacidad);
  const [ubicacion, setUbicacion] = useState(mesa.ubicacion || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(mesa.id, capacidad, ubicacion || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Mesa {mesa.numero}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="capacidad">Capacidad *</label>
              <input
                id="capacidad"
                type="number"
                min="1"
                value={capacidad}
                onChange={(e) => setCapacidad(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej: Salón Principal, Terraza..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MesaDetailModalProps {
  mesa: Mesa;
  invitados: Invitado[];
  onClose: () => void;
}

function MesaDetailModal({ mesa, invitados, onClose }: MesaDetailModalProps) {
  const { ocupados, total } = {
    ocupados: invitados.reduce((sum, inv) => sum + 1 + inv.acompanantesReales, 0),
    total: mesa.capacidad,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Mesa {mesa.numero} - Detalles</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <div><strong>Capacidad:</strong> {total} personas</div>
            <div><strong>Ocupación:</strong> {ocupados} / {total} personas</div>
            {mesa.ubicacion && <div><strong>Ubicación:</strong> {mesa.ubicacion}</div>}
          </div>

          <h3>Invitados Asignados ({invitados.length})</h3>
          {invitados.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No hay invitados asignados a esta mesa</p>
          ) : (
            <table style={{ width: '100%', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acompañantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {invitados.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.nombre} {inv.apellido}</td>
                    <td>{inv.acompanantesReales} / {inv.acompanantesEsperados}</td>
                    <td>
                      <span className={`badge badge-${inv.estado}`}>{inv.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

