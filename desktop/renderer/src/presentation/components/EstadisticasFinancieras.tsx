import { EstadisticasFinancieras as EstadisticasType } from '@shared/types/Servicio';
import './EstadisticasFinancieras.css';

interface EstadisticasFinancierasProps {
  estadisticas: EstadisticasType;
}

export function EstadisticasFinancieras({ estadisticas }: EstadisticasFinancierasProps) {
  return (
    <div className="estadisticas-financieras">
      <h2>Resumen Financiero</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${estadisticas.total.toLocaleString()}</div>
            <div className="stat-label">Total de Costos</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">${estadisticas.pagado.toLocaleString()}</div>
            <div className="stat-label">Pagado</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">${estadisticas.pendiente.toLocaleString()}</div>
            <div className="stat-label">Pendiente</div>
          </div>
        </div>
      </div>

      {estadisticas.porProveedor.length > 0 && (
        <div className="por-proveedor">
          <h3>Por Proveedor</h3>
          <div className="proveedores-list">
            {estadisticas.porProveedor.map((item, index) => (
              <div key={index} className="proveedor-item">
                <div className="proveedor-nombre">{item.nombre}</div>
                <div className="proveedor-stats">
                  <span>Total: ${item.total.toLocaleString()}</span>
                  <span>Pagado: ${item.pagado.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

