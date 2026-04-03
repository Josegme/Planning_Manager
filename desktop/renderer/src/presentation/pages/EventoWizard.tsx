import { useState } from 'react';
import { CreateEventoDTO } from '@shared/types/DTOs';
import { useEventos } from '../hooks/useEventos';
import './EventoWizard.css';

interface EventoWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function EventoWizard({ onComplete, onCancel }: EventoWizardProps) {
  const { createEvento } = useEventos();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateEventoDTO>>({
    nombre: '',
    tipo: null,
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: null,
    tieneMesas: true,
    cantidadMesas: 0,
    capacidadMesa: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.tieneMesas) {
      if (!formData.cantidadMesas || formData.cantidadMesas <= 0) {
        newErrors.cantidadMesas = 'La cantidad de mesas debe ser mayor a 0';
      }
      if (!formData.capacidadMesa || formData.capacidadMesa <= 0) {
        newErrors.capacidadMesa = 'La capacidad por mesa debe ser mayor a 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // Verificar que electronAPI esté disponible antes de intentar crear
    if (typeof window === 'undefined' || !window.electronAPI) {
      alert('⚠️ Error: La aplicación debe ejecutarse desde Electron, no desde el navegador.\n\nPor favor, cierra esta ventana del navegador y ejecuta:\n\ncd desktop\nnpm run dev\n\nEsto abrirá la aplicación en una ventana de Electron donde todas las funcionalidades estarán disponibles.');
      return;
    }

    setLoading(true);
    try {
      const nuevoEvento = await createEvento(formData as CreateEventoDTO);
      console.log('Evento creado:', nuevoEvento);
      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage.includes('Electron API no disponible')) {
        alert('⚠️ Error: Electron API no disponible.\n\nPor favor:\n1. Cierra esta ventana del navegador\n2. Ejecuta: cd desktop && npm run build:main\n3. Luego ejecuta: cd desktop && npm run dev\n\nLa aplicación debe ejecutarse desde Electron, no desde el navegador.');
      } else {
        alert('Error al crear evento: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreateEventoDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al modificar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="evento-wizard">
      <div className="wizard-header">
        <h2>Crear Nuevo Evento</h2>
        <div className="wizard-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Datos Básicos</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Mesas</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Resumen</span>
          </div>
        </div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <Step1DatosBasicos
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        )}

        {step === 2 && (
          <Step2Mesas
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        )}

        {step === 3 && (
          <Step3Resumen
            formData={formData as CreateEventoDTO}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>

      <div className="wizard-actions">
        {step > 1 && (
          <button className="btn-secondary" onClick={handleBack}>
            Anterior
          </button>
        )}
        {step < 3 ? (
          <button className="btn-primary" onClick={handleNext}>
            Siguiente
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Evento'}
          </button>
        )}
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

interface StepProps {
  formData: Partial<CreateEventoDTO>;
  errors: Record<string, string>;
  updateField: (field: keyof CreateEventoDTO, value: any) => void;
}

function Step1DatosBasicos({ formData, errors, updateField }: StepProps) {
  return (
    <div className="wizard-step">
      <h3>Datos Básicos del Evento</h3>
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Evento *</label>
        <input
          id="nombre"
          type="text"
          value={formData.nombre || ''}
          onChange={(e) => updateField('nombre', e.target.value)}
          className={errors.nombre ? 'error' : ''}
          placeholder="Ej: Boda de Juan y María"
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="tipo">Tipo de Evento</label>
        <input
          id="tipo"
          type="text"
          value={formData.tipo || ''}
          onChange={(e) => updateField('tipo', e.target.value || null)}
          placeholder="Ej: Boda, Cumpleaños, Corporativo"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fecha">Fecha *</label>
          <input
            id="fecha"
            type="date"
            value={formData.fecha || ''}
            onChange={(e) => updateField('fecha', e.target.value)}
            className={errors.fecha ? 'error' : ''}
          />
          {errors.fecha && <span className="error-message">{errors.fecha}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora</label>
          <input
            id="hora"
            type="time"
            value={formData.hora || ''}
            onChange={(e) => updateField('hora', e.target.value || null)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="lugar">Lugar</label>
        <input
          id="lugar"
          type="text"
          value={formData.lugar || ''}
          onChange={(e) => updateField('lugar', e.target.value || null)}
          placeholder="Ej: Salón de Eventos XYZ"
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={formData.descripcion || ''}
          onChange={(e) => updateField('descripcion', e.target.value || null)}
          rows={4}
          placeholder="Descripción adicional del evento..."
        />
      </div>
    </div>
  );
}

function Step2Mesas({ formData, errors, updateField }: StepProps) {
  return (
    <div className="wizard-step">
      <h3>Configuración de Mesas</h3>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.tieneMesas || false}
            onChange={(e) => {
              updateField('tieneMesas', e.target.checked);
              if (!e.target.checked) {
                updateField('cantidadMesas', 0);
                updateField('capacidadMesa', 0);
              }
            }}
          />
          <span>Este evento tiene mesas asignadas</span>
        </label>
      </div>

      {formData.tieneMesas && (
        <>
          <div className="form-group">
            <label htmlFor="cantidadMesas">Cantidad de Mesas *</label>
            <input
              id="cantidadMesas"
              type="number"
              min="1"
              value={formData.cantidadMesas || 0}
              onChange={(e) => updateField('cantidadMesas', parseInt(e.target.value) || 0)}
              className={errors.cantidadMesas ? 'error' : ''}
            />
            {errors.cantidadMesas && <span className="error-message">{errors.cantidadMesas}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="capacidadMesa">Capacidad por Mesa *</label>
            <input
              id="capacidadMesa"
              type="number"
              min="1"
              value={formData.capacidadMesa || 0}
              onChange={(e) => updateField('capacidadMesa', parseInt(e.target.value) || 0)}
              className={errors.capacidadMesa ? 'error' : ''}
            />
            {errors.capacidadMesa && <span className="error-message">{errors.capacidadMesa}</span>}
            <small className="form-hint">Cantidad de personas por mesa</small>
          </div>

          {formData.cantidadMesas && formData.capacidadMesa && (
            <div className="info-box">
              <strong>Capacidad Total:</strong> {formData.cantidadMesas * formData.capacidadMesa} personas
            </div>
          )}
        </>
      )}

      {!formData.tieneMesas && (
        <div className="info-box">
          <p>Este evento no tendrá mesas asignadas. Los invitados se registrarán sin asignación de mesa.</p>
        </div>
      )}
    </div>
  );
}

interface Step3Props {
  formData: CreateEventoDTO;
  onSubmit: () => void;
  loading: boolean;
}

function Step3Resumen({ formData, onSubmit: _onSubmit, loading: _loading }: Step3Props) {
  const fecha = formData.fecha ? new Date(formData.fecha).toLocaleDateString('es-AR') : '';

  return (
    <div className="wizard-step">
      <h3>Resumen del Evento</h3>
      <p>Revise la información antes de crear el evento:</p>

      <div className="resumen-card">
        <h4>Datos Básicos</h4>
        <div className="resumen-item">
          <strong>Nombre:</strong> {formData.nombre}
        </div>
        {formData.tipo && (
          <div className="resumen-item">
            <strong>Tipo:</strong> {formData.tipo}
          </div>
        )}
        <div className="resumen-item">
          <strong>Fecha:</strong> {fecha}
        </div>
        {formData.hora && (
          <div className="resumen-item">
            <strong>Hora:</strong> {formData.hora}
          </div>
        )}
        {formData.lugar && (
          <div className="resumen-item">
            <strong>Lugar:</strong> {formData.lugar}
          </div>
        )}
        {formData.descripcion && (
          <div className="resumen-item">
            <strong>Descripción:</strong> {formData.descripcion}
          </div>
        )}
      </div>

      <div className="resumen-card">
        <h4>Configuración de Mesas</h4>
        {formData.tieneMesas ? (
          <>
            <div className="resumen-item">
              <strong>Cantidad de Mesas:</strong> {formData.cantidadMesas}
            </div>
            <div className="resumen-item">
              <strong>Capacidad por Mesa:</strong> {formData.capacidadMesa} personas
            </div>
            <div className="resumen-item highlight">
              <strong>Capacidad Total:</strong> {formData.cantidadMesas * formData.capacidadMesa} personas
            </div>
          </>
        ) : (
          <div className="resumen-item">
            <strong>Sin mesas asignadas</strong>
          </div>
        )}
      </div>
    </div>
  );
}

