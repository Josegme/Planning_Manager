import { useState } from 'react';
import { Evento, EstadoEvento } from '@shared/types/Evento';
import { UpdateEventoDTO } from '@shared/types/DTOs';
import './Modal.css';

interface EventoFormModalProps {
  evento: Evento;
  onClose: () => void;
  onSuccess: () => void;
  updateEvento: (dto: UpdateEventoDTO) => Promise<Evento>;
}

export function EventoFormModal({ evento, onClose, onSuccess, updateEvento }: EventoFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: evento.nombre,
    tipo: evento.tipo || '',
    fecha: evento.fecha,
    hora: evento.hora || '',
    lugar: evento.lugar || '',
    descripcion: evento.descripcion || '',
    cantidadMesas: evento.cantidadMesas,
    capacidadMesa: evento.capacidadMesa,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dto: UpdateEventoDTO = {
        id: evento.id,
        nombre: formData.nombre,
        tipo: formData.tipo || null,
        fecha: formData.fecha,
        hora: formData.hora || null,
        lugar: formData.lugar || null,
        descripcion: formData.descripcion || null,
        cantidadMesas: formData.cantidadMesas,
        capacidadMesa: formData.capacidadMesa,
      };

      await updateEvento(dto);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Evento</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {evento.estado === EstadoEvento.FINALIZADO && (
          <p style={{ margin: '0 20px 10px', padding: '8px 12px', background: '#fff3cd', borderRadius: '4px', fontSize: '14px' }}>
            Este evento está finalizado. Puede editarlo de todos modos.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Evento *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo de Evento</label>
              <input
                id="tipo"
                type="text"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                placeholder="Ej: Boda, Cumpleaños, Corporativo..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hora">Hora</label>
                <input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lugar">Lugar</label>
              <input
                id="lugar"
                type="text"
                value={formData.lugar}
                onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                placeholder="Dirección o nombre del lugar"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            {evento.tieneMesas && (
              <>
                <div className="form-group">
                  <label htmlFor="cantidadMesas">Cantidad de Mesas *</label>
                  <input
                    id="cantidadMesas"
                    type="number"
                    min="1"
                    value={formData.cantidadMesas}
                    onChange={(e) => setFormData({ ...formData, cantidadMesas: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacidadMesa">Capacidad por Mesa *</label>
                  <input
                    id="capacidadMesa"
                    type="number"
                    min="1"
                    value={formData.capacidadMesa}
                    onChange={(e) => setFormData({ ...formData, capacidadMesa: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

