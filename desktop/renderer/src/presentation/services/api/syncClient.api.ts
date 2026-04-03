export interface SyncEventoData {
  evento: any;
  invitados: any[];
  mesas: any[];
  timeline: any[];
  servicios: any[];
}

export interface CheckInData {
  invitadoId: string;
  acompanantesReales: number;
}

export interface FindInvitadoByQRResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Cliente HTTP para conectarse al servidor de sincronización
 */
export class SyncClient {
  private baseUrl: string | null = null;
  private isConnected: boolean = false;

  /**
   * Conecta al servidor de sincronización
   */
  connect(serverUrl: string): void {
    // Asegurar que la URL tenga http://
    if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
      this.baseUrl = `http://${serverUrl}`;
    } else {
      this.baseUrl = serverUrl;
    }
    
    // Remover trailing slash
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
    this.isConnected = true;
  }

  /**
   * Desconecta del servidor
   */
  disconnect(): void {
    this.baseUrl = null;
    this.isConnected = false;
  }

  /**
   * Verifica si está conectado
   */
  getIsConnected(): boolean {
    return this.isConnected && this.baseUrl !== null;
  }

  /**
   * Obtiene la URL base del servidor
   */
  getBaseUrl(): string | null {
    return this.baseUrl;
  }

  /**
   * Verifica la conexión con el servidor (health check)
   */
  async checkConnection(): Promise<boolean> {
    if (!this.baseUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      return false;
    }
  }

  /**
   * Obtiene la lista de eventos del servidor (para seleccionar cuál sincronizar)
   */
  async getEventos(): Promise<Array<{ id: string; nombre: string; fecha: string; estado?: string }>> {
    if (!this.baseUrl) {
      throw new Error('No hay conexión al servidor');
    }
    const response = await fetch(`${this.baseUrl}/api/eventos`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al obtener eventos');
    }
    return Array.isArray(data.data) ? data.data : [];
  }

  /**
   * Sincroniza un evento completo
   */
  async syncEvento(eventoId: string): Promise<SyncEventoData> {
    if (!this.baseUrl) {
      throw new Error('No hay conexión al servidor');
    }

    try {
      // Obtener todos los datos del evento en paralelo
      const [eventoRes, invitadosRes, mesasRes, timelineRes, serviciosRes] = await Promise.all([
        fetch(`${this.baseUrl}/api/eventos/${eventoId}`),
        fetch(`${this.baseUrl}/api/invitados/${eventoId}`),
        fetch(`${this.baseUrl}/api/mesas/${eventoId}`),
        fetch(`${this.baseUrl}/api/timeline/${eventoId}`),
        fetch(`${this.baseUrl}/api/servicios/${eventoId}`),
      ]);

      if (!eventoRes.ok) {
        throw new Error(`Error al obtener evento: ${eventoRes.statusText}`);
      }

      const eventoData = await eventoRes.json();
      const invitadosData = await invitadosRes.json();
      const mesasData = await mesasRes.json();
      const timelineData = await timelineRes.json();
      const serviciosData = await serviciosRes.json();

      return {
        evento: eventoData.success ? eventoData.data : null,
        invitados: invitadosData.success ? invitadosData.data : [],
        mesas: mesasData.success ? mesasData.data : [],
        timeline: timelineData.success ? timelineData.data : [],
        servicios: serviciosData.success ? serviciosData.data : [],
      };
    } catch (error) {
      console.error('Error al sincronizar evento:', error);
      throw error;
    }
  }

  /**
   * Busca un invitado por código QR
   */
  async findInvitadoByQR(codigoQR: string, eventoId: string): Promise<FindInvitadoByQRResult> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: 'No hay conexión al servidor',
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/invitados/findByQR/${encodeURIComponent(codigoQR)}/${eventoId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Invitado no encontrado',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error('Error al buscar invitado por QR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Envía un check-in al servidor
   */
  async sendCheckIn(checkInData: CheckInData): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: 'No hay conexión al servidor',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/invitados/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Error al procesar check-in',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error('Error al enviar check-in:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}

// Instancia singleton del cliente
export const syncClient = new SyncClient();
