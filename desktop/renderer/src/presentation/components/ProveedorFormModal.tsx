import React, { useState, useEffect } from 'react';
import { Proveedor, CreateProveedorDTO, UpdateProveedorDTO } from '@shared/types/Proveedor';
import './Modal.css';

interface ProveedorFormModalProps {
  proveedor: Proveedor | null;
  onClose: () => void;
  onSuccess: () => void;
  createProveedor: (dto: CreateProveedorDTO) => Promise<Proveedor>;
  updateProveedor: (dto: UpdateProveedorDTO) => Promise<Proveedor>;
}

export function ProveedorFormModal({
  proveedor,
  onClose,
  onSuccess,
  createProveedor,
  updateProveedor,
}: ProveedorFormModalProps) {
  const [nombre, setNombre] = useState('');
  const [servicioQuePresta, setServicioQuePresta] = useState('');
  const [contacto, setContacto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre);
      setServicioQuePresta(proveedor.servicioQuePresta || '');
      setContacto(proveedor.contacto || '');
      setEmail(proveedor.email || '');
      setTelefono(proveedor.telefono || '');
      setDireccion(proveedor.direccion || '');
    }
  }, [proveedor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (proveedor) {
        await updateProveedor({
          id: proveedor.id,
          nombre,
          servicioQuePresta: servicioQuePresta || null,
          contacto: contacto || null,
          email: email || null,
          telefono: telefono || null,
          direccion: direccion || null,
        });
      } else {
        await createProveedor({
          nombre,
          servicioQuePresta: servicioQuePresta || null,
          contacto: contacto || null,
          email: email || null,
          telefono: telefono || null,
          direccion: direccion || null,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
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
                placeholder="Ej: Catering ABC"
              />
            </div>

            <div className="form-group">
              <label htmlFor="servicioQuePresta">Servicio que presta</label>
              <input
                id="servicioQuePresta"
                type="text"
                value={servicioQuePresta}
                onChange={(e) => setServicioQuePresta(e.target.value)}
                placeholder="Ej: Catering, DJ, Florería"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contacto">Contacto</label>
              <input
                id="contacto"
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre de contacto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="proveedor@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                rows={2}
                placeholder="Dirección del proveedor"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : proveedor ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

