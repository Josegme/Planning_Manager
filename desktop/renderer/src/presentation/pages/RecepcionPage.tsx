import { useState, useEffect, useRef } from 'react';
import { syncClient } from '../services/api/syncClient.api';
import { syncApi } from '../services/api/sync.api';
import { QRScanner } from '../components/QRScanner';
import { CheckInForm } from '../components/CheckInForm';
import { Invitado } from '@shared/types/Invitado';
import type { SyncEventoData } from '../services/api/syncClient.api';
import './RecepcionPage.css';

interface RecepcionPageProps {
  eventoId: string;
  eventoNombre: string;
  eventoData: SyncEventoData | null;
  isConnected: boolean;
  syncEvento: (eventoId: string) => Promise<void>;
  checkConnection: () => Promise<boolean>;
  isLoadingSync: boolean;
  onDisconnect: () => void;
}

export function RecepcionPage({
  eventoId,
  eventoNombre,
  eventoData,
  isConnected,
  syncEvento,
  checkConnection,
  isLoadingSync: _isLoadingSync,
  onDisconnect,
}: RecepcionPageProps) {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [selectedInvitado, setSelectedInvitado] = useState<Invitado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastCheckIns, setLastCheckIns] = useState<Invitado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const prevConnectedRef = useRef(isConnected);
  const isProcessingQRRef = useRef(false);
  const lastQRCooldownRef = useRef<{ text: string; until: number } | null>(null);

  const cancelledRef = useRef(false);

  // Cargar caché al montar (modo offline - Plan Fase 4.1 / 6.1)
  useEffect(() => {
    cancelledRef.current = false;
    (async () => {
      try {
        const cached = await syncApi.getEventoCache(eventoId);
        if (cancelledRef.current || !cached) return;
        const data = cached as SyncEventoData & { savedAt?: string };
        if (data.invitados?.length) {
          setInvitados(data.invitados);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelledRef.current = true; };
  }, [eventoId]);

  // Sincronizar evento cuando hay conexión
  useEffect(() => {
    if (isConnected && eventoId) {
      loadEventoData();
    }
  }, [isConnected, eventoId]);

  // Guardar caché cuando se sincroniza correctamente
  useEffect(() => {
    if (!eventoData || !eventoId) return;
    syncApi.saveEventoCache(eventoId, eventoData).catch(() => {});
  }, [eventoData, eventoId]);

  // Actualizar invitados cuando se sincroniza
  useEffect(() => {
    if (eventoData?.invitados) {
      setInvitados(eventoData.invitados);
    }
  }, [eventoData]);

  // Al reconectar: enviar cola de check-ins pendientes (Plan Fase 4.2 / 6.1)
  useEffect(() => {
    if (!isConnected) {
      prevConnectedRef.current = false;
      return;
    }
    if (prevConnectedRef.current === false) {
      prevConnectedRef.current = true;
      (async () => {
        try {
          const pending = await syncApi.getPendingCheckIns();
          for (const item of pending) {
            const result = await syncClient.sendCheckIn({
              invitadoId: item.invitadoId,
              acompanantesReales: item.acompanantesReales ?? 0,
            });
            if (result.success && result.data) {
              setLastCheckIns((prev) => [result.data as Invitado, ...prev].slice(0, 10));
            }
          }
          if (pending.length > 0) {
            await syncApi.clearPendingCheckIns();
            setPendingCount(0);
            setSuccess(`${pending.length} check-in(s) sincronizados con el servidor`);
          }
        } catch {
          // keep pending for next reconnect
        }
      })();
    }
  }, [isConnected]);

  // Contar pendientes al montar y periódicamente
  useEffect(() => {
    const updatePending = async () => {
      try {
        const list = await syncApi.getPendingCheckIns();
        setPendingCount(list.length);
      } catch {
        setPendingCount(0);
      }
    };
    updatePending();
    const interval = setInterval(updatePending, 3000);
    return () => clearInterval(interval);
  }, []);

  // Verificar conexión periódicamente
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(async () => {
      const connected = await checkConnection();
      if (!connected) {
        setError('Conexión perdida con el servidor');
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const loadEventoData = async () => {
    try {
      setError(null);
      await syncEvento(eventoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del evento');
    }
  };

  const handleQRScan = async (decodedText: string) => {
    setShowQRScanner(false);
    setError(null);
    setSuccess(null);

    if (isProcessingQRRef.current) return;
    const now = Date.now();
    if (lastQRCooldownRef.current && lastQRCooldownRef.current.text === decodedText && now < lastQRCooldownRef.current.until) {
      return;
    }
    lastQRCooldownRef.current = { text: decodedText, until: now + 2500 };
    isProcessingQRRef.current = true;

    try {
      const result = await syncClient.findInvitadoByQR(decodedText, eventoId);
      
      if (result.success && result.data) {
        const invitado = result.data as Invitado;
        
        // Verificar si ya hizo check-in
        if (invitado.estado === 'confirmado') {
          setError('Este invitado ya realizó check-in');
          return;
        }

        setSelectedInvitado(invitado);
        setShowCheckInForm(true);
      } else {
        setError(result.error || 'Invitado no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar invitado');
    } finally {
      isProcessingQRRef.current = false;
    }
  };

  const handleCheckInConfirm = async (acompanantesReales: number) => {
    if (!selectedInvitado) return;

    setError(null);
    setSuccess(null);

    try {
      if (isConnected) {
        const result = await syncClient.sendCheckIn({
          invitadoId: selectedInvitado.id,
          acompanantesReales,
        });

        if (result.success) {
          setSuccess(`Check-in confirmado para ${selectedInvitado.nombre} ${selectedInvitado.apellido}`);
          setShowCheckInForm(false);
          setSelectedInvitado(null);
          if (result.data) {
            setLastCheckIns((prev) => [result.data as Invitado, ...prev].slice(0, 10));
          }
          await loadEventoData();
          return;
        }
      }

      // Offline o fallo: guardar en cola local (Plan Fase 4.2 / 6.1)
      await syncApi.addPendingCheckIn({
        invitadoId: selectedInvitado.id,
        acompanantesReales,
      });
      setPendingCount((c) => c + 1);
      setSuccess(`Check-in guardado localmente. Se enviará al reconectar (${selectedInvitado.nombre} ${selectedInvitado.apellido}).`);
      setShowCheckInForm(false);
      setSelectedInvitado(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar check-in');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setError(null);
    setSuccess(null);

    // Buscar por nombre, apellido o DNI
    const found = invitados.find(
      (inv) =>
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.dni?.includes(searchTerm)
    );

    if (found) {
      if (found.estado === 'confirmado') {
        setError('Este invitado ya realizó check-in');
        return;
      }
      setSelectedInvitado(found);
      setShowCheckInForm(true);
    } else {
      setError('Invitado no encontrado');
    }
  };

  const invitadosPendientes = invitados.filter((inv) => inv.estado === 'pendiente');
  const invitadosConfirmados = invitados.filter((inv) => inv.estado === 'confirmado');

  return (
    <div className="recepcion-page">
      <div className="recepcion-header">
        <div className="header-info">
          <h1>📋 Recepción - {eventoNombre}</h1>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'status-active' : 'status-inactive'}`} />
            <span>{isConnected ? 'Conectado' : 'Modo Offline'}</span>
            {pendingCount > 0 && (
              <span className="pending-badge">{pendingCount} pendiente(s)</span>
            )}
          </div>
        </div>
        <button onClick={onDisconnect} className="btn-disconnect">
          Desconectar
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          ✅ {success}
        </div>
      )}

      <div className="recepcion-content">
        <div className="recepcion-actions">
          <div className="action-card">
            <h3>Escanear QR</h3>
            <p>Escanea el código QR del invitado</p>
            <button
              onClick={() => setShowQRScanner(true)}
              className="btn btn-primary btn-large"
              disabled={!isConnected}
              title={!isConnected ? 'Requiere conexión al servidor' : ''}
            >
              📱 Escanear QR
            </button>
          </div>

          <div className="action-card">
            <h3>Buscar Manualmente</h3>
            <p>Busca por nombre, apellido o DNI</p>
            <div className="search-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nombre, apellido o DNI..."
                className="search-input"
                disabled={invitados.length === 0}
                title={invitados.length === 0 ? 'Espere sincronización o use caché' : ''}
              />
              <button
                onClick={handleSearch}
                className="btn btn-success"
                disabled={invitados.length === 0 || !searchTerm.trim()}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="recepcion-stats">
          <div className="stat-box">
            <div className="stat-value">{invitados.length}</div>
            <div className="stat-label">Total Invitados</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{invitadosPendientes.length}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-box success">
            <div className="stat-value">{invitadosConfirmados.length}</div>
            <div className="stat-label">Check-in Realizados</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">
              {invitados.length > 0
                ? Math.round((invitadosConfirmados.length / invitados.length) * 100)
                : 0}%
            </div>
            <div className="stat-label">Asistencia</div>
          </div>
        </div>

        {lastCheckIns.length > 0 && (
          <div className="last-checkins">
            <h3>Últimos Check-ins</h3>
            <div className="checkins-list">
              {lastCheckIns.map((inv) => (
                <div key={inv.id} className="checkin-item">
                  <span className="checkin-name">{inv.nombre} {inv.apellido}</span>
                  <span className="checkin-time">
                    {inv.checkinAt
                      ? new Date(inv.checkinAt).toLocaleTimeString()
                      : 'Ahora'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {showCheckInForm && selectedInvitado && (
        <CheckInForm
          invitado={selectedInvitado}
          acompanantesEsperados={selectedInvitado.acompanantesEsperados || 0}
          onConfirm={handleCheckInConfirm}
          onCancel={() => {
            setShowCheckInForm(false);
            setSelectedInvitado(null);
          }}
        />
      )}
    </div>
  );
}
