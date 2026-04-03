import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScanner.css';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
  instructions?: string;
}

export function QRScanner({ onScanSuccess, onScanError, onClose, instructions }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const lastDecodedRef = useRef<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_cameraId, setCameraId] = useState<string | null>(null);

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    lastDecodedRef.current = null;
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      // Obtener lista de cámaras
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        const selectedCameraId = devices[0].id;
        setCameraId(selectedCameraId);

        await html5QrCode.start(
          selectedCameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (lastDecodedRef.current === decodedText) return;
            lastDecodedRef.current = decodedText;
            stopScanning();
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignorar errores de escaneo (solo mostrar si es crítico)
            if (errorMessage.includes('NotFoundException')) {
              setError('No se encontró cámara');
            }
          }
        );

        isScanningRef.current = true;
        setIsScanning(true);
        setError(null);
      } else {
        setError('No se encontraron cámaras disponibles');
      }
    } catch (err) {
      console.error('Error al iniciar escáner:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar escáner');
      if (onScanError) {
        onScanError(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
  };

  const stopScanning = async () => {
    if (!scannerRef.current || !isScanningRef.current) return;
    isScanningRef.current = false;
    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    } catch (err) {
      console.error('Error al detener escáner:', err);
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        <div className="qr-scanner-header">
          <h3>Escanear Código QR</h3>
          <button className="qr-scanner-close" onClick={handleClose}>×</button>
        </div>

        <div className="qr-scanner-body">
          {error ? (
            <div className="qr-scanner-error">
              <p>{error}</p>
              <button onClick={startScanning}>Reintentar</button>
            </div>
          ) : (
            <>
              <div id="qr-reader" style={{ width: '100%' }}></div>
              <p className="qr-scanner-instructions">
                {instructions || 'Apunta la cámara hacia el código QR'}
              </p>
            </>
          )}
        </div>

        <div className="qr-scanner-footer">
          <button onClick={handleClose} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
