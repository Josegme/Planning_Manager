import { useState } from 'react';
import { Invitado } from '@shared/types/Invitado';
import './CheckInForm.css';

interface CheckInFormProps {
  invitado: Invitado;
  acompanantesEsperados: number;
  onConfirm: (acompanantesReales: number) => void;
  onCancel: () => void;
}

export function CheckInForm({ invitado, acompanantesEsperados, onConfirm, onCancel }: CheckInFormProps) {
  const [acompanantesReales, setAcompanantesReales] = useState(acompanantesEsperados);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(acompanantesReales);
  };

  return (
    <div className="checkin-form-overlay">
      <div className="checkin-form-container">
        <div className="checkin-form-header">
          <h3>Confirmar Check-in</h3>
        </div>

        <div className="checkin-form-body">
          <div className="invitado-info">
            <h4>{invitado.nombre} {invitado.apellido}</h4>
            {invitado.dni && <p><strong>DNI:</strong> {invitado.dni}</p>}
            {invitado.mesaId && <p><strong>Mesa:</strong> {invitado.mesaId}</p>}
            {invitado.grupo && <p><strong>Grupo:</strong> {invitado.grupo}</p>}
            {invitado.menu && <p><strong>Menú:</strong> {invitado.menu}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="acompanantes">
                Acompañantes Esperados: {acompanantesEsperados}
              </label>
              <input
                type="number"
                id="acompanantes"
                min="0"
                max="20"
                value={acompanantesReales}
                onChange={(e) => setAcompanantesReales(parseInt(e.target.value) || 0)}
                className="form-input"
              />
              <small>Ingrese la cantidad real de acompañantes que llegaron</small>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-confirm">
                Confirmar Check-in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
