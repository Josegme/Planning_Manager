import { useState, useEffect } from 'react';
import { syncApi, ServerStatus } from '../services/api/sync.api';
import { ConnectionQRModal } from './ConnectionQRModal';
import './SyncServerPanel.css';

export function SyncServerPanel() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
    // Actualizar estado cada 5 segundos
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const serverStatus = await syncApi.getServerStatus();
      setStatus(serverStatus);
      setError(null);
    } catch (err) {
      console.error('Error al obtener estado del servidor:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleStartServer = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await syncApi.startServer();
      
      if (result.success) {
        await loadStatus();
      } else {
        setError(result.error || 'Error al iniciar servidor');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStopServer = async () => {
    if (!window.confirm('¿Está seguro de detener el servidor? Las computadoras de recepción perderán la conexión.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await syncApi.stopServer();
      
      if (result.success) {
        await loadStatus();
      } else {
        setError(result.error || 'Error al detener servidor');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al detener servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = () => {
    if (!status?.isRunning) {
      alert('El servidor debe estar corriendo para generar el QR de conexión');
      return;
    }
    setShowQRModal(true);
  };

  return (
    <div className="sync-server-panel">
      <div className="sync-server-header">
        <h3>🔄 Sincronización Multi-Computadora</h3>
      </div>

      <div className="sync-server-content">
        {error && (
          <div className="sync-server-error">
            ⚠️ {error}
          </div>
        )}

        {status ? (
          <>
            <div className="sync-server-status">
              <div className="status-indicator">
                <span
                  className={`status-dot ${status.isRunning ? 'status-active' : 'status-inactive'}`}
                />
                <span className="status-text">
                  {status.isRunning ? 'Servidor Activo' : 'Servidor Inactivo'}
                </span>
              </div>

              {status.isRunning && status.ip && (
                <div className="sync-server-info">
                  <div className="info-item">
                    <strong>IP Local:</strong> {status.ip}
                  </div>
                  <div className="info-item">
                    <strong>Puerto:</strong> {status.port}
                  </div>
                  <div className="info-item">
                    <strong>URL:</strong> http://{status.ip}:{status.port}
                  </div>
                </div>
              )}
            </div>

            <div className="sync-server-actions">
              {status.isRunning ? (
                <>
                  <button
                    onClick={handleShowQR}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    📱 Mostrar QR de Conexión
                  </button>
                  <button
                    onClick={handleStopServer}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    ⏹️ Detener Servidor
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartServer}
                  className="btn btn-success"
                  disabled={loading}
                >
                  ▶️ Iniciar Servidor
                </button>
              )}
            </div>

            {status.isRunning && (
              <div className="sync-server-help">
                <p>
                  <strong>Instrucciones:</strong> Una vez iniciado el servidor, otras computadoras
                  pueden conectarse usando el código QR o ingresando la URL manualmente.
                  El servidor funciona solo en red local (WiFi o cable), no requiere internet.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="sync-server-loading">
            Cargando estado del servidor...
          </div>
        )}
      </div>

      {showQRModal && (
        <ConnectionQRModal onClose={() => setShowQRModal(false)} />
      )}
    </div>
  );
}
