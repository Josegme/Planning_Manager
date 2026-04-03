import { useState, useEffect } from 'react';
import { syncClient } from '../services/api/syncClient.api';
import { QRScanner } from '../components/QRScanner';
import './ConnectionPage.css';

interface EventoOption {
  id: string;
  nombre: string;
  fecha: string;
  estado?: string;
}

interface ConnectionPageProps {
  connect: (serverUrl: string) => Promise<boolean>;
  isConnecting: boolean;
  connectionError: string | null;
  isConnected: boolean;
  syncEvento: (eventoId: string) => Promise<void>;
  isLoadingSync: boolean;
  onEventoSelected: (evento: { id: string; nombre: string }) => void;
  onSwitchToOrganizador?: () => void;
  eventoId?: string;
}

export function ConnectionPage({
  connect,
  isConnecting,
  connectionError,
  isConnected,
  syncEvento,
  isLoadingSync,
  onEventoSelected,
  onSwitchToOrganizador,
  eventoId,
}: ConnectionPageProps) {
  const [serverUrl, setServerUrl] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventosList, setEventosList] = useState<EventoOption[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [syncingEventoId, setSyncingEventoId] = useState<string | null>(null);

  // Validar si el texto escaneado es un QR de invitado (formato: EVT...-INV...)
  const isGuestQR = (text: string): boolean => {
    return text.startsWith('EVT') && text.includes('-INV');
  };

  // Validar si el texto es una URL válida del servidor
  const isValidServerURL = (text: string): boolean => {
    try {
      const url = new URL(text);
      return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
    } catch {
      // Si no tiene http://, intentar agregarlo
      if (!text.includes('://')) {
        try {
          const url = new URL(`http://${text}`);
          return url.hostname.length > 0;
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  // Al conectar sin eventoId: cargar lista de eventos del servidor (Plan Fase 4.1)
  useEffect(() => {
    if (!isConnected || eventoId) return;
    setError(null);
    setLoadingEventos(true);
    syncClient
      .getEventos()
      .then((list) => setEventosList(list))
      .catch((err) => setError(err.message || 'Error al cargar eventos'))
      .finally(() => setLoadingEventos(false));
  }, [isConnected, eventoId]);

  const handleSelectEvento = async (ev: EventoOption) => {
    setError(null);
    setSyncingEventoId(ev.id);
    try {
      await syncEvento(ev.id);
      onEventoSelected({ id: ev.id, nombre: ev.nombre });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al sincronizar evento');
    } finally {
      setSyncingEventoId(null);
    }
  };

  const handleConnect = async () => {
    const urlToConnect = serverUrl.trim();
    
    if (!urlToConnect) {
      setError('Por favor ingrese la URL del servidor');
      return;
    }

    // Validar que no sea un QR de invitado
    if (isGuestQR(urlToConnect)) {
      setError('❌ Error: Escaneó un QR de invitado. Debe escanear el QR de conexión del servidor que muestra el organizador en su computadora.');
      return;
    }

    // Validar formato de URL
    if (!isValidServerURL(urlToConnect)) {
      setError('❌ URL inválida. Debe ser una URL válida (ejemplo: http://192.168.1.100:8080)');
      return;
    }

    setError(null);
    
    // Timeout para evitar bloqueos
    const timeoutId = setTimeout(() => {
      setError('⏱️ Tiempo de conexión agotado. Verifique que el servidor esté activo y la URL sea correcta.');
    }, 10000); // 10 segundos

    try {
      const success = await connect(urlToConnect);
      clearTimeout(timeoutId);
      
      if (!success) {
        setError(connectionError || 'No se pudo conectar al servidor. Verifique que el servidor esté activo y ambas computadoras estén en la misma red.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    }
    // El useEffect manejará la sincronización y onConnected
  };

  const handleQRScan = async (decodedText: string) => {
    setShowQRScanner(false);
    setError(null);
    
    // Validar que no sea un QR de invitado
    if (isGuestQR(decodedText)) {
      setError('❌ Error: Escaneó un QR de invitado. Debe escanear el QR de conexión del servidor que muestra el organizador en su computadora (botón "Mostrar QR" en el panel de sincronización).');
      setServerUrl('');
      return;
    }

    // Validar formato de URL
    if (!isValidServerURL(decodedText)) {
      setError('❌ QR inválido. El código QR escaneado no es una URL válida del servidor.');
      setServerUrl('');
      return;
    }

    setServerUrl(decodedText);
    
    // Timeout para evitar bloqueos
    const timeoutId = setTimeout(() => {
      setError('⏱️ Tiempo de conexión agotado. Verifique que el servidor esté activo y el QR sea correcto.');
    }, 10000); // 10 segundos

    try {
      // Intentar conectar automáticamente
      const success = await connect(decodedText);
      clearTimeout(timeoutId);
      
      if (!success) {
        setError(connectionError || 'No se pudo conectar al servidor. Verifique que el servidor esté activo y ambas computadoras estén en la misma red.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    }
    // El useEffect manejará la sincronización y onConnected
  };

  return (
    <div className="connection-page">
      <div className="connection-container">
        <div className="connection-header">
          <h1>🔄 Modo Recepción</h1>
          <p>Conecte esta computadora al servidor del organizador</p>
        </div>

        <div className="connection-content">
          {error && (
            <div className="connection-error">
              ⚠️ {error}
            </div>
          )}

          <div className="connection-methods">
            <div className="method-section">
              <h3>Método 1: Escanear Código QR</h3>
              <p><strong>Escanea el QR de conexión del servidor</strong> que muestra el organizador en su computadora (botón "Mostrar QR" en el panel de sincronización)</p>
              <button
                onClick={() => setShowQRScanner(true)}
                className="btn btn-primary"
                disabled={isConnecting}
              >
                📱 Escanear QR de Conexión
              </button>
            </div>

            <div className="method-divider">
              <span>O</span>
            </div>

            <div className="method-section">
              <h3>Método 2: Ingresar URL Manualmente</h3>
              <p>Ingrese la URL del servidor (ejemplo: http://192.168.1.100:8080)</p>
              <div className="input-group">
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="http://192.168.1.100:8080"
                  className="url-input"
                  disabled={isConnecting}
                />
                <button
                  onClick={handleConnect}
                  className="btn btn-success"
                  disabled={isConnecting || !serverUrl.trim()}
                >
                  {isConnecting ? 'Conectando...' : 'Conectar'}
                </button>
              </div>
            </div>
          </div>

          {isConnected && !eventoId && (
            <div className="connection-eventos">
              <h3>Seleccione el evento a sincronizar</h3>
              {loadingEventos ? (
                <p className="connection-loading">Cargando eventos...</p>
              ) : eventosList.length === 0 ? (
                <p className="connection-no-events">No hay eventos en el servidor.</p>
              ) : (
                <ul className="connection-eventos-list">
                  {eventosList.map((ev) => (
                    <li key={ev.id}>
                      <button
                        type="button"
                        className="btn btn-event"
                        onClick={() => handleSelectEvento(ev)}
                        disabled={syncingEventoId !== null || isLoadingSync}
                      >
                        <span className="event-name">{ev.nombre}</span>
                        <span className="event-date">{ev.fecha ? new Date(ev.fecha).toLocaleDateString('es-AR') : ''}</span>
                        {syncingEventoId === ev.id ? ' Sincronizando...' : ''}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {onSwitchToOrganizador && (
            <div className="connection-switch-mode">
              <button
                type="button"
                className="btn btn-link"
                onClick={onSwitchToOrganizador}
              >
                🖥️ Usar como Organizador
              </button>
            </div>
          )}

          <div className="connection-help">
            <h4>💡 Ayuda</h4>
            <ul>
              <li><strong>Importante:</strong> Escanee el QR de <strong>conexión del servidor</strong> (no el QR de invitados). El organizador lo muestra con el botón "Mostrar QR" en su panel.</li>
              <li>Ambas computadoras deben estar en la misma red WiFi o conectadas por cable</li>
              <li>No se requiere conexión a internet</li>
              <li>El organizador debe tener el servidor activo en su computadora</li>
              <li>La URL típica es: http://[IP]:8080 (ejemplo: http://192.168.1.100:8080)</li>
              <li>Después de conectar, seleccionará el evento para realizar check-ins</li>
            </ul>
          </div>
        </div>
      </div>

      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          instructions="Apunta la cámara hacia el QR de conexión del servidor (no el QR de invitados)"
        />
      )}
    </div>
  );
}
