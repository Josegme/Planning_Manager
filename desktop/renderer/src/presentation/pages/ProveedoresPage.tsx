import { useState } from 'react';
import { useProveedores } from '../hooks/useProveedores';
import { Proveedor } from '@shared/types/Proveedor';
import { ProveedorFormModal } from '../components/ProveedorFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { proveedoresApi } from '../services/api/proveedores.api';
import './ProveedoresPage.css';

export function ProveedoresPage() {
  const { proveedores, loading, error, createProveedor, updateProveedor, deleteProveedor } = useProveedores();
  const [searchServicio, setSearchServicio] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; proveedorId: string | null }>({
    show: false,
    proveedorId: null,
  });

  const proveedoresFiltrados = !searchServicio.trim()
    ? proveedores
    : proveedores.filter(
        (p) =>
          p.servicioQuePresta &&
          p.servicioQuePresta.toLowerCase().includes(searchServicio.trim().toLowerCase())
      );

  const handleCreate = () => {
    setEditingProveedor(null);
    setShowFormModal(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, proveedorId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.proveedorId) {
      try {
        await deleteProveedor(deleteConfirm.proveedorId);
        setDeleteConfirm({ show: false, proveedorId: null });
      } catch (err) {
        console.error('Error al eliminar proveedor:', err);
        setDeleteConfirm({ show: false, proveedorId: null });
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando proveedores...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleExportExcel = async () => {
    try {
      await proveedoresApi.exportExcel(proveedoresFiltrados);
    } catch (err) {
      console.error('Error al exportar:', err);
      alert(err instanceof Error ? err.message : 'Error al exportar');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="proveedores-page">
      <div className="page-header">
        <h1>Gestión de Proveedores</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportExcel} disabled={proveedoresFiltrados.length === 0}>
            📥 Exportar Excel
          </button>
          <button className="btn-secondary" onClick={handleImprimir} disabled={proveedoresFiltrados.length === 0}>
            🖨️ Imprimir lista
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            ➕ Nuevo Proveedor
          </button>
        </div>
      </div>

      <div className="proveedores-search">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por servicio que presta..."
          value={searchServicio}
          onChange={(e) => setSearchServicio(e.target.value)}
        />
      </div>

      <div className="proveedores-list">
        {proveedores.length === 0 ? (
          <div className="empty-state">
            <p>No hay proveedores registrados</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Crea el primer proveedor para comenzar
            </p>
          </div>
        ) : proveedoresFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>Ningún proveedor coincide con «{searchServicio}»</p>
          </div>
        ) : (
          <div className="proveedores-grid">
            {proveedoresFiltrados.map(proveedor => (
              <div key={proveedor.id} className="proveedor-card">
                <div className="proveedor-header">
                  <h3>{proveedor.nombre}</h3>
                </div>

                <div className="proveedor-body">
                  {proveedor.servicioQuePresta && (
                    <div className="proveedor-info proveedor-servicio">
                      <strong>Servicio:</strong> {proveedor.servicioQuePresta}
                    </div>
                  )}
                  {proveedor.contacto && (
                    <div className="proveedor-info">
                      <strong>Contacto:</strong> {proveedor.contacto}
                    </div>
                  )}
                  {proveedor.email && (
                    <div className="proveedor-info">
                      <strong>Email:</strong> {proveedor.email}
                    </div>
                  )}
                  {proveedor.telefono && (
                    <div className="proveedor-info">
                      <strong>Teléfono:</strong> {proveedor.telefono}
                    </div>
                  )}
                  {proveedor.direccion && (
                    <div className="proveedor-info">
                      <strong>Dirección:</strong> {proveedor.direccion}
                    </div>
                  )}
                </div>

                <div className="proveedor-actions">
                  <button className="btn-secondary" onClick={() => handleEdit(proveedor)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDeleteClick(proveedor.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Área imprimible (oculta en pantalla, visible al imprimir) */}
      <div id="proveedores-print-content" className="print-only">
        <h1>Lista de Proveedores</h1>
        <table className="print-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Servicio</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.servicioQuePresta ?? '-'}</td>
                <td>{p.contacto ?? '-'}</td>
                <td>{p.email ?? '-'}</td>
                <td>{p.telefono ?? '-'}</td>
                <td>{p.direccion ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {showFormModal && (
        <ProveedorFormModal
          proveedor={editingProveedor}
          onClose={() => {
            setShowFormModal(false);
            setEditingProveedor(null);
          }}
          onSuccess={() => {
            setShowFormModal(false);
            setEditingProveedor(null);
          }}
          createProveedor={createProveedor}
          updateProveedor={updateProveedor}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmModal
          title="Eliminar Proveedor"
          message="¿Está seguro de eliminar este proveedor? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false, proveedorId: null })}
          variant="danger"
        />
      )}
    </div>
  );
}

