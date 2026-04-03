export enum EstadoInvitado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

export class Invitado {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public dni: string | null,
    public nombre: string,
    public apellido: string,
    public email: string | null,
    public telefono: string | null,
    public grupo: string | null,
    public menu: string | null,
    public mesaId: string | null,
    public qrCode: string | null,
    public estado: EstadoInvitado,
    public acompanantesEsperados: number,
    public acompanantesReales: number,
    public checkinAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Validaciones de negocio
  static validarDNI(dni: string | null): boolean {
    if (!dni) return true; // DNI es opcional
    // Validar formato básico (solo números, 7-8 dígitos)
    return /^\d{7,8}$/.test(dni);
  }

  static validarEmail(email: string | null): boolean {
    if (!email) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validarTelefono(telefono: string | null): boolean {
    if (!telefono) return true; // Teléfono es opcional
    // Validar formato básico (números, espacios, guiones, paréntesis)
    return /^[\d\s\-\(\)]+$/.test(telefono);
  }

  // Generar código QR único
  generarQRCode(): string {
    if (this.qrCode) return this.qrCode;
    
    // Generar código único con formato estándar: EVT{evento_id}-INV{invitado_id}-{hash}
    const { createHash } = require('crypto');
    const hash = createHash('sha256')
      .update(`${this.eventoId}:${this.id}:${Date.now()}`)
      .digest('hex')
      .substring(0, 8); // Primeros 8 caracteres del hash
    
    this.qrCode = `EVT${this.eventoId}-INV${this.id}-${hash}`;
    return this.qrCode;
  }

  // Regenerar QR code (forzar nueva generación)
  regenerarQRCode(): string {
    this.qrCode = null;
    return this.generarQRCode();
  }

  // Marcar check-in
  hacerCheckIn(acompanantesReales: number = 0): void {
    this.estado = EstadoInvitado.CONFIRMADO;
    this.acompanantesReales = acompanantesReales;
    this.checkinAt = new Date();
  }

  // Cancelar invitación
  cancelar(): void {
    this.estado = EstadoInvitado.CANCELADO;
  }

  // Obtener nombre completo
  getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  // Validar datos del invitado
  validar(): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre es requerido');
    }

    if (!this.apellido || this.apellido.trim().length === 0) {
      errores.push('El apellido es requerido');
    }

    if (this.dni && !Invitado.validarDNI(this.dni)) {
      errores.push('El DNI debe tener 7 u 8 dígitos');
    }

    if (this.email && !Invitado.validarEmail(this.email)) {
      errores.push('El email no tiene un formato válido');
    }

    if (this.telefono && !Invitado.validarTelefono(this.telefono)) {
      errores.push('El teléfono no tiene un formato válido');
    }

    if (this.acompanantesEsperados < 0) {
      errores.push('Los acompañantes esperados no pueden ser negativos');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

