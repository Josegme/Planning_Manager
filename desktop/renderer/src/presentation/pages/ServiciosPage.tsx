import React, { useState } from 'react';
import { useServicios } from '../hooks/useServicios';
import { useProveedores } from '../hooks/useProveedores';
import { serviciosApi } from '../services/api/servicios.api';
import { excelApi } from '../services/api/excel.api';
import { Servicio, EstadoServicio } from '@shared/types/Servicio';
import { ServicioFormModal } from '../components/ServicioFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { EstadisticasFinancieras } from '../components/EstadisticasFinancieras';
import './ServiciosPage.css';

interface ServiciosPageProps {
  eventoId: string;
  eventoNombre: string;
}

export function ServiciosPage({ eventoId, eventoNombre }: ServiciosPageProps) {
  const { servicios, loading, error, createServicio, updateServicio, deleteServicio, refetch } = useServicios(eventoId);
  const { proveedores } = useProveedores();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; servicioId: string | null }>({
    show: false,
    servicioId: null,
  });
  const [importing, setImporting] = useState(false);

  React.useEffect(() => {
    loadEstadisticas();
  }, [servicios]);

  const loadEstadisticas = async () => {
    try {
      const stats = await serviciosApi.getEstadisticas(eventoId);
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleCreate = () => {
    setEditingServicio(null);
    setShowFormModal(true);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, servicioId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.servicioId) {
      try {
        await deleteServicio(deleteConfirm.servicioId);
        setDeleteConfirm({ show: false, servicioId: null });
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
        setDeleteConfirm({ show: false, servicioId: null });
      }
    }
  };

  const getEstadoLabel = (estado: EstadoServicio): string => {
    const labels: Record<EstadoServicio, string> = {
      [EstadoServicio.COTIZADO]: 'Cotizado',
      [EstadoServicio.CONTRATADO]: 'Contratado',
      [EstadoServicio.PAGADO]: 'Pagado',
      [EstadoServicio.CANCELADO]: 'Cancelado',
    };
    return labels[estado];
  };

  const getEstadoColor = (estado: EstadoServicio): string => {
    const colors: Record<EstadoServicio, string> = {
      [EstadoServicio.COTIZADO]: '#9E9E9E',
      [EstadoServicio.CONTRATADO]: '#2196F3',
      [EstadoServicio.PAGADO]: '#4CAF50',
      [EstadoServicio.CANCELADO]: '#F44336',
    };
    return colors[estado];
  };

  const handleExportExcel = async () => {
    try {
      await excelApi.exportServicios(eventoId, servicios, eventoNombre, proveedores);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al exportar');
    }
  };

  const handleImportExcel = async () => {
    try {
      const filePath = await excelApi.selectFile();
      const { filas } = await excelApi.parseFileServicios(filePath, eventoId);
      setImporting(true);
      let created = 0;
      for (const row of filas) {
        const proveedorId = row.proveedorNombre
          ? proveedores.find(p => p.nombre.trim().toLowerCase() === row.proveedorNombre!.trim().toLowerCase())?.id ?? null
          : null;
        await createServicio({
          eventoId,
          proveedorId: proveedorId ?? undefined,
          nombre: row.nombre,
          descripcion: row.descripcion ?? undefined,
          costoUnitario: row.costoUnitario,
          cantidad: row.cantidad,
          moneda: row.moneda,
        });
        created++;
      }
      await refetch();
      await loadEstadisticas();
      alert(`Se importaron ${created} servicio(s).`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al importar. Verifique que el archivo tenga la estructura correcta.');
    } finally {
      setImporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTemplate = async () => {
    try {
      const path = await excelApi.generateTemplateServicios();
      alert(`Plantilla guardada en: ${path}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al generar plantilla');
    }
  };

  if (loading) {
    return <div className="loading">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="servicios-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Servicios</h1>
          <p className="evento-nombre">{eventoNombre}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={handleDownloadTemplate}
            title="Descargar plantilla con la estructura esperada"
          >
            📋 Plantilla
          </button>
          <button
            className="btn-secondary"
            onClick={handleImportExcel}
            disabled={importing}
            title="Importar planilla desde Excel"
          >
            📥 Importar Excel
          </button>
          <button
            className="btn-secondary"
            onClick={handleExportExcel}
            disabled={servicios.length === 0}
            title="Exportar planilla a Excel"
          >
            📤 Exportar Excel
          </button>
          <button
            className="btn-secondary"
            onClick={handlePrint}
            title="Imprimir o guardar como PDF"
          >
            🖨️ Imprimir / PDF
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            ➕ Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Estadísticas Financieras */}
      {estadisticas && (
        <EstadisticasFinancieras estadisticas={estadisticas} />
      )}

      {/* Tabla de servicios (estructura tipo planilla) */}
      <div className="servicios-list">
        {servicios.length === 0 ? (
          <div className="empty-state">
            <p>No hay servicios registrados para este evento</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Crea el primer servicio para comenzar
            </p>
          </div>
        ) : (
          <div className="servicios-table-container">
            <table className="servicios-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Proveedor</th>
                  <th>Detalle</th>
                  <th>Costo unit.</th>
                  <th>Cant.</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Pagado / Pendiente</th>
                  <th>Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map(servicio => {
                  const proveedor = proveedores.find(p => p.id === servicio.proveedorId);
                  const contacto = proveedor
                    ? [proveedor.telefono, proveedor.email].filter(Boolean).join(' · ') || proveedor.contacto || '-'
                    : '-';
                  const pendiente = servicio.costoTotal - servicio.pagosParciales;
                  return (
                    <tr key={servicio.id}>
                      <td className="servicio-nombre">{servicio.nombre}</td>
                      <td>{proveedor?.nombre ?? '-'}</td>
                      <td className="servicio-detalle">{servicio.descripcion ?? '-'}</td>
                      <td>{servicio.moneda} {servicio.costoUnitario.toLocaleString()}</td>
                      <td>{servicio.cantidad}</td>
                      <td className="servicio-total">{servicio.moneda} {servicio.costoTotal.toLocaleString()}</td>
                      <td>
                        <span
                          className="estado-badge"
                          style={{
                            background: getEstadoColor(servicio.estado),
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {getEstadoLabel(servicio.estado)}
                        </span>
                      </td>
                      <td>
                        <span className="pago-info">
                          {servicio.moneda} {servicio.pagosParciales.toLocaleString()}
                          {servicio.porcentajePagado > 0 && ` (${servicio.porcentajePagado}%)`}
                        </span>
                        <span className="pendiente-info">
                          Pend: {servicio.moneda} {pendiente.toLocaleString()}
                        </span>
                      </td>
                      <td className="servicio-contacto">{contacto}</td>
                      <td>
                        <div className="servicio-actions">
                          <button className="btn-sm btn-edit" onClick={() => handleEdit(servicio)} title="Editar">
                            ✏️
                          </button>
                          <button className="btn-sm btn-delete" onClick={() => handleDeleteClick(servicio.id)} title="Eliminar">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showFormModal && (
        <ServicioFormModal
          eventoId={eventoId}
          servicio={editingServicio}
          proveedores={proveedores}
          onClose={() => {
            setShowFormModal(false);
            setEditingServicio(null);
          }}
          onSuccess={async () => {
            setShowFormModal(false);
            setEditingServicio(null);
            await refetch();
            await loadEstadisticas();
          }}
          createServicio={createServicio}
          updateServicio={updateServicio}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmModal
          title="Eliminar Servicio"
          message="¿Está seguro de eliminar este servicio? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false, servicioId: null })}
          variant="danger"
        />
      )}
    </div>
  );
}

