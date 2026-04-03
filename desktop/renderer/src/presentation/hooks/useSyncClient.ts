import { useState, useEffect, useCallback } from 'react';
import { syncClient, SyncEventoData } from '../services/api/syncClient.api';

export interface UseSyncClientReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  eventoData: SyncEventoData | null;
  isLoading: boolean;
  connect: (serverUrl: string) => Promise<boolean>;
  disconnect: () => void;
  syncEvento: (eventoId: string) => Promise<void>;
  checkConnection: () => Promise<boolean>;
  baseUrl: string | null;
}

export function useSyncClient(): UseSyncClientReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [eventoData, setEventoData] = useState<SyncEventoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Verificar conexión periódicamente
  useEffect(() => {
    if (!isConnected || isSyncing) return;

    const interval = setInterval(async () => {
      const connected = await syncClient.checkConnection();
      if (!connected) {
        setIsConnected(false);
        setConnectionError('Conexión perdida con el servidor');
      }
    }, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval);
  }, [isConnected, isSyncing]);

  const connect = useCallback(async (serverUrl: string): Promise<boolean> => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      syncClient.connect(serverUrl);
      setBaseUrl(syncClient.getBaseUrl());

      // Verificar conexión
      const connected = await syncClient.checkConnection();
      
      if (connected) {
        setIsConnected(true);
        return true;
      } else {
        syncClient.disconnect();
        setBaseUrl(null);
        setConnectionError('No se pudo conectar al servidor. Verifica la URL.');
        return false;
      }
    } catch (error) {
      syncClient.disconnect();
      setBaseUrl(null);
      setConnectionError(error instanceof Error ? error.message : 'Error al conectar');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    syncClient.disconnect();
    setIsConnected(false);
    setBaseUrl(null);
    setEventoData(null);
    setConnectionError(null);
  }, []);

  const syncEvento = useCallback(async (eventoId: string) => {
    if (!isConnected) {
      throw new Error('No hay conexión al servidor');
    }

    setIsSyncing(true);
    setIsLoading(true);
    try {
      const data = await syncClient.syncEvento(eventoId);
      setEventoData(data);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Error al sincronizar');
      throw error;
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [isConnected]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!isConnected) return false;
    
    const connected = await syncClient.checkConnection();
    if (!connected) {
      setIsConnected(false);
      setConnectionError('Conexión perdida');
    }
    return connected;
  }, [isConnected]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    eventoData,
    isLoading,
    connect,
    disconnect,
    syncEvento,
    checkConnection,
    baseUrl,
  };
}
