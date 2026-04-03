import { useState, useEffect } from 'react';
import { useInvitados } from '../hooks/useInvitados';
import { Invitado, EstadoInvitado } from '@shared/types/Invitado';
import { ImportExcelModal } from '../components/ImportExcelModal';
import { InvitadoFormModal } from '../components/InvitadoFormModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { mesasApi, Mesa } from '../services/api/mesas.api';
import { EventosAPI } from '../services/api/eventos.api';
import { excelApi } from '../services/api/excel.api';
import { invitadosApi } from '../services/api/invitados.api';
import JSZip from 'jszip';
import './InvitadosPage.css';

interface InvitadosPageProps {
  eventoId: string;
  eventoNombre: string;
}

export function InvitadosPage({ eventoId, eventoNombre }: InvitadosPageProps) {
  const { invitados, loading, error, createInvitado, updateInvitado, deleteInvitado, checkIn, refetch } = useInvitados(eventoId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterGrupo, setFilterGrupo] = useState<string>('all');
  const [filterMenu, setFilterMenu] = useState<string>('all');
  const [filterMesa, setFilterMesa] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('apellido');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingInvitado, setEditingInvitado] = useState<Invitado | null>(null);
  const [qrInvitado, setQrInvitado] = useState<Invitado | null>(null);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [eventoMesasConfig, setEventoMesasConfig] = useState<{ tieneMesas: boolean; cantidadMesas: number; capacidadMesa: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; invitadoId: string | null }>({
    show: false,
    invitadoId: null,
  });
  const [assignConfirm, setAssignConfirm] = useState<{ show: boolean }>({ show: false });
  const [checkInInvitado, setCheckInInvitado] = useState<Invitado | null>(null);
  const [acompanantesInput, setAcompanantesInput] = useState<string>('0');
  const [downloadingZIP, setDownloadingZIP] = useState(false);

  useEffect(() => {
    const loadMesas = async () => {
      try {
        const evento = await EventosAPI.getById(eventoId);
        setEventoMesasConfig({
          tieneMesas: evento.tieneMesas,
          cantidadMesas: evento.cantidadMesas ?? 0,
          capacidadMesa: evento.capacidadMesa ?? 0,
        });
        if (evento.tieneMesas) {
          let mesasData = await mesasApi.getByEvento(eventoId);
          if (evento.cantidadMesas > 0 && mesasData.length < evento.cantidadMesas) {
            mesasData = await mesasApi.createFromEvento(eventoId, evento.cantidadMesas, evento.capacidadMesa);
          }
          setMesas(mesasData);
        }
      } catch (err) {
        console.error('Error al cargar mesas:', err);
      }
    };
    loadMesas();
  }, [eventoId]);

  const filteredInvitados = invitados.filter(inv => {
    const matchesSearch = 
      inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.dni && inv.dni.includes(searchTerm)) ||
      (inv.email && inv.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEstado = filterEstado === 'all' || inv.estado === filterEstado;
    const matchesGrupo = filterGrupo === 'all' || (inv.grupo && inv.grupo === filterGrupo);
    const matchesMenu = filterMenu === 'all' || (inv.menu && inv.menu === filterMenu);
    const matchesMesa = filterMesa === 'all' || (inv.mesaId && inv.mesaId === filterMesa);
    
    return matchesSearch && matchesEstado && matchesGrupo && matchesMenu && matchesMesa;
  });

  // Obtener valores únicos para filtros
  const gruposUnicos = Array.from(new Set(invitados.map(i => i.grupo).filter(Boolean))) as string[];
  const menusUnicos = Array.from(new Set(invitados.map(i => i.menu).filter(Boolean))) as string[];

  // Ordenar invitados
  const sortedInvitados = [...filteredInvitados].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortBy) {
      case 'nombre':
        aVal = a.nombre.toLowerCase();
        bVal = b.nombre.toLowerCase();
        break;
      case 'apellido':
        aVal = a.apellido.toLowerCase();
        bVal = b.apellido.toLowerCase();
        break;
      case 'dni':
        aVal = a.dni || '';
        bVal = b.dni || '';
        break;
      case 'email':
        aVal = a.email?.toLowerCase() || '';
        bVal = b.email?.toLowerCase() || '';
        break;
      case 'mesa':
        aVal = mesas.find(m => m.id === a.mesaId)?.numero || 0;
        bVal = mesas.find(m => m.id === b.mesaId)?.numero || 0;
        break;
      case 'grupo':
        aVal = a.grupo?.toLowerCase() || '';
        bVal = b.grupo?.toLowerCase() || '';
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCreate = () => {
    setEditingInvitado(null);
    setShowFormModal(true);
  };

  const handleEdit = (invitado: Invitado) => {
    setEditingInvitado(invitado);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, invitadoId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.invitadoId) {
      try {
        await deleteInvitado(deleteConfirm.invitadoId);
        setDeleteConfirm({ show: false, invitadoId: null });
      } catch (err) {
        setDeleteConfirm({ show: false, invitadoId: null });
      }
    }
  };

  const handleCheckInClick = (invitado: Invitado) => {
    setCheckInInvitado(invitado);
    setAcompanantesInput('0');
  };

  const handleCheckInConfirm = async () => {
    if (checkInInvitado) {
      const num = parseInt(acompanantesInput, 10);
      if (!isNaN(num) && num >= 0 && num <= checkInInvitado.acompanantesEsperados) {
        await checkIn(checkInInvitado.id, num);
        setCheckInInvitado(null);
        setAcompanantesInput('0');
      }
    }
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    refetch();
  };

  const handleDownloadAllQRs = async () => {
    const conQR = invitados.filter(i => i.qrCode && i.qrCode.trim() !== '');
    if (conQR.length === 0) return;
    setDownloadingZIP(true);
    try {
      const zip = new JSZip();
      for (const inv of conQR) {
        if (!inv.qrCode) continue;
        const dataURL = await invitadosApi.generarQRImagen(inv.qrCode);
        const base64 = dataURL.replace(/^data:image\/\w+;base64,/, '');
        const name = `${inv.nombre}_${inv.apellido}`.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_') || `invitado_${inv.id}`;
        zip.file(`${name}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_invitados_${eventoNombre.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_') || eventoId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al generar ZIP de QRs:', err);
      alert('Error al descargar los QR. ' + (err instanceof Error ? err.message : ''));
    } finally {
      setDownloadingZIP(false);
    }
  };

  const estadisticas = {
    total: invitados.length,
    pendientes: invitados.filter(i => i.estado === EstadoInvitado.PENDIENTE).length,
    confirmados: invitados.filter(i => i.estado === EstadoInvitado.CONFIRMADO).length,
    cancelados: invitados.filter(i => i.estado === EstadoInvitado.CANCELADO).length,
    conEmail: invitados.filter(i => i.email && i.email.trim() !== '').length,
    conTelefono: invitados.filter(i => i.telefono && i.telefono.trim() !== '').length,
    conQR: invitados.filter(i => i.qrCode && i.qrCode.trim() !== '').length,
  };

  return (
    <div className="invitados-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Invitados</h1>
          <p className="evento-nombre">{eventoNombre}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={() => {
              if (mesas.length === 0 || invitados.length === 0) {
                return;
              }
              setAssignConfirm({ show: true });
            }}
            title="Asignar mesas automáticamente"
            disabled={mesas.length === 0 || invitados.length === 0}
          >
            🎯 Asignar Mesas
          </button>
          <button className="btn-secondary" onClick={() => setShowImportModal(true)}>
            📥 Importar Excel
          </button>
          <button 
            className="btn-secondary" 
            onClick={async () => {
              if (invitados.length === 0) return;
              try {
                await excelApi.exportInvitados(eventoId, invitados, eventoNombre);
              } catch (err) {
                console.error('Error al exportar:', err);
              }
            }}
            disabled={invitados.length === 0}
          >
            📤 Exportar Excel
          </button>
          {estadisticas.conQR > 0 && (
            <button
              className="btn-secondary"
              onClick={handleDownloadAllQRs}
              disabled={downloadingZIP}
              title="Descargar todos los códigos QR en un archivo ZIP"
            >
              {downloadingZIP ? '⏳ Generando ZIP...' : '📦 Descargar todos los QR (ZIP)'}
            </button>
          )}
          <button className="btn-primary" onClick={handleCreate}>
            ➕ Nuevo Invitado
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-invitados">
        <div className="stat-item">
          <span className="stat-value">{estadisticas.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item warning">
          <span className="stat-value">{estadisticas.pendientes}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-item success">
          <span className="stat-value">{estadisticas.confirmados}</span>
          <span className="stat-label">Confirmados</span>
        </div>
        <div className="stat-item info">
          <span className="stat-value">{estadisticas.cancelados}</span>
          <span className="stat-label">Cancelados</span>
        </div>
        <div className="stat-item" style={{ background: '#e3f2fd' }}>
          <span className="stat-value">{estadisticas.conEmail}</span>
          <span className="stat-label">Con Email</span>
        </div>
        <div className="stat-item" style={{ background: '#f3e5f5' }}>
          <span className="stat-value">{estadisticas.conTelefono}</span>
          <span className="stat-label">Con Teléfono</span>
        </div>
        <div className="stat-item" style={{ background: '#e8f5e9' }}>
          <span className="stat-value">{estadisticas.conQR}</span>
          <span className="stat-label">QR Generados</span>
        </div>
      </div>

      {eventoMesasConfig?.tieneMesas && (
        <div className="info-mesas-evento">
          <span className="info-mesas-icon">🪑</span>
          <span className="info-mesas-text">
            Mesas: {eventoMesasConfig.cantidadMesas} mesas ({eventoMesasConfig.capacidadMesa} personas c/u) — {eventoMesasConfig.cantidadMesas * eventoMesasConfig.capacidadMesa} personas total
          </span>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, DNI o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ flex: '1', minWidth: '200px' }}
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos los estados</option>
          <option value={EstadoInvitado.PENDIENTE}>Pendientes</option>
          <option value={EstadoInvitado.CONFIRMADO}>Confirmados</option>
          <option value={EstadoInvitado.CANCELADO}>Cancelados</option>
        </select>
        {gruposUnicos.length > 0 && (
          <select
            value={filterGrupo}
            onChange={(e) => setFilterGrupo(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los grupos</option>
            {gruposUnicos.map(grupo => (
              <option key={grupo} value={grupo}>{grupo}</option>
            ))}
          </select>
        )}
        {menusUnicos.length > 0 && (
          <select
            value={filterMenu}
            onChange={(e) => setFilterMenu(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los menús</option>
            {menusUnicos.map(menu => (
              <option key={menu} value={menu}>{menu}</option>
            ))}
          </select>
        )}
        {mesas.length > 0 && (
          <select
            value={filterMesa}
            onChange={(e) => setFilterMesa(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las mesas</option>
            {mesas.map(mesa => (
              <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero}</option>
            ))}
          </select>
        )}
      </div>

      {/* Lista de invitados */}
      {loading && <div className="loading">Cargando invitados...</div>}
      {error && (
        <div className="error" style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', margin: '20px' }}>
          <strong>❌ Error:</strong> {error}
          <br />
          <small>Si ves "Electron API no disponible", ejecuta: <code>npm run build:main</code> desde la carpeta desktop/</small>
        </div>
      )}
      
      {!loading && filteredInvitados.length === 0 && (
        <div className="empty-state">
          <p>No hay invitados {searchTerm || filterEstado !== 'all' ? 'que coincidan con los filtros' : 'registrados'}</p>
        </div>
      )}

      {!loading && sortedInvitados.length > 0 && (
        <div className="invitados-table-container">
          <table className="invitados-table">
            <thead>
              <tr>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (sortBy === 'nombre') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('nombre');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Nombre {sortBy === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (sortBy === 'dni') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('dni');
                      setSortOrder('asc');
                    }
                  }}
                >
                  DNI {sortBy === 'dni' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (sortBy === 'email') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('email');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Teléfono</th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (sortBy === 'grupo') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('grupo');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Grupo {sortBy === 'grupo' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (sortBy === 'mesa') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('mesa');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Mesa {sortBy === 'mesa' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Estado</th>
                <th>Acompañantes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvitados.map(invitado => (
                <tr key={invitado.id}>
                  <td>{`${invitado.nombre} ${invitado.apellido}`}</td>
                  <td>{invitado.dni || '-'}</td>
                  <td>{invitado.email || '-'}</td>
                  <td>{invitado.telefono || '-'}</td>
                  <td>{invitado.grupo || '-'}</td>
                  <td>
                    {invitado.mesaId 
                      ? `Mesa ${mesas.find(m => m.id === invitado.mesaId)?.numero || '?'}`
                      : '-'
                    }
                  </td>
                  <td>
                    <span className={`badge badge-${invitado.estado}`}>
                      {invitado.estado}
                    </span>
                  </td>
                  <td>
                    {invitado.acompanantesReales > 0 
                      ? `${invitado.acompanantesReales}/${invitado.acompanantesEsperados}`
                      : invitado.acompanantesEsperados > 0 
                        ? `0/${invitado.acompanantesEsperados}`
                        : '0'
                    }
                  </td>
                  <td>
                    <div className="action-buttons">
                      {invitado.estado === EstadoInvitado.PENDIENTE && (
                        <button
                          className="btn-sm btn-success"
                          onClick={() => handleCheckInClick(invitado)}
                          title="Check-in"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn-sm"
                        onClick={() => {
                          setQrInvitado(invitado);
                          setShowQRModal(true);
                        }}
                        title="Ver QR Code"
                        style={{ background: '#e3f2fd', border: '1px solid #90caf9' }}
                      >
                        📱
                      </button>
                      <button
                        className="btn-sm btn-edit"
                        onClick={() => handleEdit(invitado)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-sm btn-delete"
                        onClick={() => handleDeleteClick(invitado.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      {showImportModal && (
        <ImportExcelModal
          eventoId={eventoId}
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {showFormModal && (
        <InvitadoFormModal
          eventoId={eventoId}
          invitado={editingInvitado}
          onClose={() => {
            setShowFormModal(false);
            setEditingInvitado(null);
          }}
          onSuccess={() => {
            setShowFormModal(false);
            setEditingInvitado(null);
            refetch();
          }}
          createInvitado={createInvitado}
          updateInvitado={updateInvitado}
        />
      )}

      {showQRModal && qrInvitado && (
        <QRCodeModal
          invitado={qrInvitado}
          onClose={() => {
            setShowQRModal(false);
            setQrInvitado(null);
          }}
          onQRRegenerated={() => {
            refetch();
            // Actualizar el invitado en el estado si está disponible
            const updated = invitados.find(inv => inv.id === qrInvitado.id);
            if (updated) {
              setQrInvitado(updated);
            }
          }}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmModal
          title="Eliminar Invitado"
          message="¿Está seguro de eliminar este invitado? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false, invitadoId: null })}
          variant="danger"
        />
      )}

      {assignConfirm.show && (
        <ConfirmModal
          title="Asignar Mesas Automáticamente"
          message={`¿Asignar automáticamente ${invitados.filter(i => !i.mesaId).length} invitados sin mesa a las mesas disponibles?`}
          confirmText="Asignar"
          cancelText="Cancelar"
          onConfirm={async () => {
            try {
              const sinMesa = invitados.filter(i => !i.mesaId);
              let mesaIndex = 0;
              for (const invitado of sinMesa) {
                const mesa = mesas[mesaIndex % mesas.length];
                await updateInvitado({ ...invitado, mesaId: mesa.id });
                mesaIndex++;
              }
              refetch();
              setAssignConfirm({ show: false });
            } catch (err) {
              console.error('Error en asignación automática:', err);
              setAssignConfirm({ show: false });
            }
          }}
          onCancel={() => setAssignConfirm({ show: false })}
          variant="info"
        />
      )}

      {checkInInvitado && (
        <div className="modal-overlay" onClick={() => setCheckInInvitado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Check-in: {checkInInvitado.nombre} {checkInInvitado.apellido}</h2>
              <button className="modal-close" onClick={() => setCheckInInvitado(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Acompañantes que llegaron (máximo {checkInInvitado.acompanantesEsperados})</label>
                <input
                  type="number"
                  min="0"
                  max={checkInInvitado.acompanantesEsperados}
                  value={acompanantesInput}
                  onChange={(e) => setAcompanantesInput(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setCheckInInvitado(null)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleCheckInConfirm}
                disabled={
                  isNaN(parseInt(acompanantesInput, 10)) ||
                  parseInt(acompanantesInput, 10) < 0 ||
                  parseInt(acompanantesInput, 10) > checkInInvitado.acompanantesEsperados
                }
              >
                Confirmar Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

