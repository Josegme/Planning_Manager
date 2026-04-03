import * as QRCode from 'qrcode';
import { createHash } from 'crypto';

export class QRCodeService {
  /**
   * Genera el código QR en formato estándar: EVT{evento_id}-INV{invitado_id}-{hash}
   */
  static generarCodigoQR(eventoId: string, invitadoId: string): string {
    const hash = createHash('sha256')
      .update(`${eventoId}:${invitadoId}:${Date.now()}`)
      .digest('hex')
      .substring(0, 8); // Primeros 8 caracteres del hash
    
    return `EVT${eventoId}-INV${invitadoId}-${hash}`;
  }

  /**
   * Genera una imagen QR como buffer (PNG)
   */
  static async generarImagenQR(codigoQR: string, options?: QRCode.QRCodeToBufferOptions): Promise<Buffer> {
    const defaultOptions: QRCode.QRCodeToBufferOptions = {
      errorCorrectionLevel: 'M',
      type: 'png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
      ...options,
    };

    return await QRCode.toBuffer(codigoQR, defaultOptions);
  }

  /**
   * Genera una imagen QR como Data URL (base64)
   */
  static async generarDataURL(codigoQR: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    const defaultOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
      ...options,
    };

    return await QRCode.toDataURL(codigoQR, defaultOptions);
  }
}

