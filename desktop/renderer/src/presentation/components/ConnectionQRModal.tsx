import { useState, useEffect } from 'react';
import { syncApi, ConnectionQR } from '../services/api/sync.api';
import './Modal.css';

interface ConnectionQRModalProps {
  onClose: () => void;
}

export function ConnectionQRModal({ onClose }: ConnectionQRModalProps) {
  const [qrData, setQrData] = useState<ConnectionQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadQR();
  }, []);

  const loadQR = async () => {
    try {
      setLoading(true);
      const data = await syncApi.generateConnectionQR();
      setQrData(data);
    } catch (error) {
      console.error('Error al generar QR de conexión:', error);
      alert('Error al generar QR: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIP = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.connectionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('Error al copiar al portapapeles');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Código QR de Conexión</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Cargando QR...</p>
            </div>
          ) : qrData ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Escanea este código QR desde la computadora de recepción para conectarse automáticamente:
                </p>
                <img
                  src={qrData.qrDataURL}
                  alt="QR de conexión"
                  style={{
                    width: '300px',
                    height: '300px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: '#fff',
                  }}
                />
              </div>

              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>URL de Conexión:</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  backgroundColor: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '14px' }}>
                    {qrData.connectionUrl}
                  </code>
                  <button
                    onClick={handleCopyIP}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: copied ? '#4caf50' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {copied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#e3f2fd', 
                padding: '15px', 
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1976d2'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Instrucciones:</p>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Abre Planning Manager en la computadora de recepción</li>
                  <li>Selecciona "Modo Recepción"</li>
                  <li>Escanea este código QR o ingresa la URL manualmente</li>
                  <li>La conexión se establecerá automáticamente</li>
                </ol>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#d32f2f' }}>Error al generar QR de conexión</p>
              <button onClick={loadQR} style={{ marginTop: '10px', padding: '8px 15px' }}>
                Reintentar
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} style={{ padding: '10px 20px' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
