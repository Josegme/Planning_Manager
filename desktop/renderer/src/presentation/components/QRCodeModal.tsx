import { useState, useEffect } from 'react';
import { Invitado } from '@shared/types/Invitado';
import { invitadosApi } from '../services/api/invitados.api';
import './Modal.css';

interface QRCodeModalProps {
  invitado: Invitado;
  onClose: () => void;
  onQRRegenerated?: () => void;
}

export function QRCodeModal({ invitado, onClose, onQRRegenerated }: QRCodeModalProps) {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const qrCode = invitado.qrCode || null;

  useEffect(() => {
    if (qrCode) {
      loadQRImage();
    } else {
      setLoading(false);
    }
  }, [qrCode]);

  const loadQRImage = async () => {
    if (!qrCode) return;
    
    try {
      setLoading(true);
      const dataURL = await invitadosApi.generarQRImagen(qrCode);
      setQrImage(dataURL);
    } catch (error) {
      console.error('Error al generar imagen QR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPNG = async () => {
    if (!qrCode) return;

    try {
      setExporting(true);
      const nombreInvitado = `${invitado.nombre}_${invitado.apellido}`;
      await invitadosApi.exportarQRPNG(qrCode, nombreInvitado);
      alert('QR Code exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar QR:', error);
      alert('Error al exportar QR Code: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExporting(false);
    }
  };

  const handleRegenerarQR = async () => {
    if (!window.confirm('¿Está seguro de regenerar el código QR? El código anterior dejará de ser válido.')) {
      return;
    }

    try {
      setRegenerating(true);
      await invitadosApi.regenerarQR(invitado.id);
      if (onQRRegenerated) {
        onQRRegenerated();
      }
      // Recargar la imagen
      const updatedInvitado = await invitadosApi.getById(invitado.id);
      if (updatedInvitado.qrCode) {
        const dataURL = await invitadosApi.generarQRImagen(updatedInvitado.qrCode);
        setQrImage(dataURL);
      }
      alert('QR Code regenerado exitosamente');
    } catch (error) {
      console.error('Error al regenerar QR:', error);
      alert('Error al regenerar QR Code: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>QR Code - {invitado.nombre} {invitado.apellido}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
          {qrCode ? (
            <>
              {loading ? (
                <div style={{ padding: '40px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                  <p>Generando imagen QR...</p>
                </div>
              ) : qrImage ? (
                <>
                  <div style={{ 
                    width: '300px', 
                    height: '300px', 
                    margin: '0 auto 20px',
                    background: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}>
                    <img 
                      src={qrImage} 
                      alt="QR Code" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto'
                      }} 
                    />
                  </div>
                  <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Código QR:</strong>
                    <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all' }}>
                      {qrCode}
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    <p>Este código QR es único para este invitado.</p>
                    <p>Puede ser escaneado para verificar asistencia al evento.</p>
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                  <p>Error al generar la imagen QR.</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
              <p>El código QR aún no ha sido generado para este invitado.</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                El QR se genera automáticamente al crear o importar el invitado.
              </p>
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {qrCode && (
            <>
              <button 
                className="btn-secondary" 
                onClick={handleExportPNG}
                disabled={exporting || loading}
              >
                {exporting ? 'Descargando...' : '📥 Descargar QR'}
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleRegenerarQR}
                disabled={regenerating || loading}
              >
                {regenerating ? 'Regenerando...' : '🔄 Regenerar QR'}
              </button>
            </>
          )}
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

