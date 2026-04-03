import { useState, useEffect } from 'react';
import { Servicio, CreateServicioDTO, UpdateServicioDTO, EstadoServicio } from '@shared/types/Servicio';
import { Proveedor } from '@shared/types/Proveedor';
import './Modal.css';

interface ServicioFormModalProps {
  eventoId: string;
  servicio: Servicio | null;
  proveedores: Proveedor[];
  onClose: () => void;
  onSuccess: () => void;
  createServicio: (dto: CreateServicioDTO) => Promise<Servicio>;
  updateServicio: (dto: UpdateServicioDTO) => Promise<Servicio>;
}

export function ServicioFormModal({
  eventoId,
  servicio,
  proveedores,
  onClose,
  onSuccess,
  createServicio,
  updateServicio,
}: ServicioFormModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proveedorId, setProveedorId] = useState<string>('');
  const [costoUnitario, setCostoUnitario] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [moneda, setMoneda] = useState<string>('ARS');
  const [estado, setEstado] = useState<EstadoServicio>(EstadoServicio.COTIZADO);
  const [pagosParciales, setPagosParciales] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (servicio) {
      setNombre(servicio.nombre);
      setDescripcion(servicio.descripcion || '');
      setProveedorId(servicio.proveedorId || '');
      setCostoUnitario(servicio.costoUnitario);
      setCantidad(servicio.cantidad);
      setMoneda(servicio.moneda);
      setEstado(servicio.estado);
      setPagosParciales(servicio.pagosParciales);
    }
  }, [servicio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (servicio) {
        await updateServicio({
          id: servicio.id,
          nombre,
          descripcion: descripcion || null,
          proveedorId: proveedorId || null,
          costoUnitario,
          cantidad,
          moneda,
          estado,
          pagosParciales,
        });
      } else {
        await createServicio({
          eventoId,
          nombre,
          descripcion: descripcion || null,
          proveedorId: proveedorId || null,
          costoUnitario,
          cantidad,
          moneda,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{servicio ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
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
                placeholder="Ej: Catering"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Descripción del servicio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="proveedor">Proveedor</label>
              <select
                id="proveedor"
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
              >
                <option value="">Sin proveedor</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="costoUnitario">Costo Unitario *</label>
                <input
                  id="costoUnitario"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costoUnitario}
                  onChange={(e) => setCostoUnitario(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cantidad">Cantidad *</label>
                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="moneda">Moneda *</label>
                <select
                  id="moneda"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  required
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {servicio && (
              <>
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoServicio)}
                  >
                    <option value={EstadoServicio.COTIZADO}>Cotizado</option>
                    <option value={EstadoServicio.CONTRATADO}>Contratado</option>
                    <option value={EstadoServicio.PAGADO}>Pagado</option>
                    <option value={EstadoServicio.CANCELADO}>Cancelado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="pagosParciales">Pagos Parciales</label>
                  <input
                    id="pagosParciales"
                    type="number"
                    step="0.01"
                    min="0"
                    value={pagosParciales}
                    onChange={(e) => setPagosParciales(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : servicio ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

