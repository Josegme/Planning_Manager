import React, { useState, useEffect } from 'react';
import { Invitado, CreateInvitadoDTO, UpdateInvitadoDTO } from '@shared/types/Invitado';
import { mesasApi, Mesa } from '../services/api/mesas.api';
import { EventosAPI } from '../services/api/eventos.api';
import './Modal.css';

interface InvitadoFormModalProps {
  eventoId: string;
  invitado?: Invitado | null;
  onClose: () => void;
  onSuccess: () => void;
  createInvitado: (dto: CreateInvitadoDTO) => Promise<Invitado>;
  updateInvitado: (dto: UpdateInvitadoDTO) => Promise<Invitado>;
}

export function InvitadoFormModal({
  eventoId,
  invitado,
  onClose,
  onSuccess,
  createInvitado,
  updateInvitado,
}: InvitadoFormModalProps) {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    grupo: '',
    menu: '',
    mesaId: '',
    acompanantesEsperados: 0,
  });
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadMesas = async () => {
      try {
        // Obtener evento para verificar si tiene mesas
        const evento = await EventosAPI.getById(eventoId);
        
        if (evento.tieneMesas) {
          let mesasData = await mesasApi.getByEvento(eventoId);
          
          // Si no hay mesas pero el evento tiene mesas configuradas, crearlas
          if (mesasData.length === 0 && evento.cantidadMesas > 0) {
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

  useEffect(() => {
    if (invitado) {
      setFormData({
        dni: invitado.dni || '',
        nombre: invitado.nombre,
        apellido: invitado.apellido,
        email: invitado.email || '',
        telefono: invitado.telefono || '',
        grupo: invitado.grupo || '',
        menu: invitado.menu || '',
        mesaId: invitado.mesaId || '',
        acompanantesEsperados: invitado.acompanantesEsperados,
      });
    }
  }, [invitado]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    }

    if (formData.dni && formData.dni.trim()) {
      const dniRegex = /^\d{7,8}$/;
      if (!dniRegex.test(formData.dni.trim())) {
        errors.dni = 'El DNI debe tener 7 u 8 dígitos';
      }
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'El email no tiene un formato válido';
      }
    }

    if (formData.telefono && formData.telefono.trim()) {
      const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
      if (!telefonoRegex.test(formData.telefono.trim()) || formData.telefono.trim().length < 8) {
        errors.telefono = 'El teléfono debe tener al menos 8 caracteres y solo números, espacios, guiones o paréntesis';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      if (invitado) {
        // Actualizar
        await updateInvitado({
          id: invitado.id,
          dni: formData.dni || null,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email || null,
          telefono: formData.telefono || null,
          grupo: formData.grupo || null,
          menu: formData.menu || null,
          mesaId: formData.mesaId || null,
          acompanantesEsperados: formData.acompanantesEsperados,
        });
      } else {
        // Crear
        await createInvitado({
          eventoId,
          dni: formData.dni || null,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email || null,
          telefono: formData.telefono || null,
          grupo: formData.grupo || null,
          menu: formData.menu || null,
          mesaId: formData.mesaId || null,
          acompanantesEsperados: formData.acompanantesEsperados,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar invitado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{invitado ? 'Editar Invitado' : 'Nuevo Invitado'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value });
                  if (fieldErrors.nombre) {
                    setFieldErrors({ ...fieldErrors, nombre: '' });
                  }
                }}
                className={fieldErrors.nombre ? 'error' : ''}
                required
              />
              {fieldErrors.nombre && <span className="error-message">{fieldErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Apellido *</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => {
                  setFormData({ ...formData, apellido: e.target.value });
                  if (fieldErrors.apellido) {
                    setFieldErrors({ ...fieldErrors, apellido: '' });
                  }
                }}
                className={fieldErrors.apellido ? 'error' : ''}
                required
              />
              {fieldErrors.apellido && <span className="error-message">{fieldErrors.apellido}</span>}
            </div>

            <div className="form-group">
              <label>DNI</label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Solo números
                  setFormData({ ...formData, dni: value });
                  if (fieldErrors.dni) {
                    setFieldErrors({ ...fieldErrors, dni: '' });
                  }
                }}
                className={fieldErrors.dni ? 'error' : ''}
                placeholder="7 u 8 dígitos"
                maxLength={8}
              />
              {fieldErrors.dni && <span className="error-message">{fieldErrors.dni}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) {
                    setFieldErrors({ ...fieldErrors, email: '' });
                  }
                }}
                className={fieldErrors.email ? 'error' : ''}
                placeholder="ejemplo@email.com"
              />
              {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => {
                  setFormData({ ...formData, telefono: e.target.value });
                  if (fieldErrors.telefono) {
                    setFieldErrors({ ...fieldErrors, telefono: '' });
                  }
                }}
                className={fieldErrors.telefono ? 'error' : ''}
                placeholder="Ej: +54 11 1234-5678"
              />
              {fieldErrors.telefono && <span className="error-message">{fieldErrors.telefono}</span>}
            </div>

            <div className="form-group">
              <label>Grupo</label>
              <input
                type="text"
                value={formData.grupo}
                onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Menú</label>
              <input
                type="text"
                value={formData.menu}
                onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
              />
            </div>

            {mesas.length > 0 && (
              <div className="form-group">
                <label>Mesa</label>
                <select
                  value={formData.mesaId}
                  onChange={(e) => setFormData({ ...formData, mesaId: e.target.value })}
                >
                  <option value="">Sin mesa asignada</option>
                  {mesas.map(mesa => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} (Capacidad: {mesa.capacidad})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Acompañantes Esperados</label>
              <input
                type="number"
                min="0"
                value={formData.acompanantesEsperados}
                onChange={(e) => setFormData({ ...formData, acompanantesEsperados: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

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

