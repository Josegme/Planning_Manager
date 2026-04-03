export enum EstadoServicio {
  COTIZADO = 'cotizado',
  CONTRATADO = 'contratado',
  PAGADO = 'pagado',
  CANCELADO = 'cancelado',
}

export class Servicio {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public proveedorId: string | null,
    public nombre: string,
    public descripcion: string | null,
    public costoUnitario: number,
    public cantidad: number,
    public costoTotal: number,
    public moneda: string,
    public estado: EstadoServicio,
    public pagosParciales: number,
    public porcentajePagado: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Calcular costo total automáticamente
  calcularCostoTotal(): void {
    this.costoTotal = this.costoUnitario * this.cantidad;
    this.calcularPorcentajePagado();
  }

  // Calcular porcentaje pagado automáticamente
  calcularPorcentajePagado(): void {
    if (this.costoTotal === 0) {
      this.porcentajePagado = 0;
      return;
    }
    this.porcentajePagado = Math.round((this.pagosParciales / this.costoTotal) * 100);
  }

  // Registrar pago parcial
  registrarPago(monto: number): void {
    this.pagosParciales += monto;
    this.calcularPorcentajePagado();
    
    if (this.porcentajePagado >= 100) {
      this.estado = EstadoServicio.PAGADO;
    } else if (this.estado === EstadoServicio.COTIZADO) {
      this.estado = EstadoServicio.CONTRATADO;
    }
  }

  // Cambiar estado
  cambiarEstado(nuevoEstado: EstadoServicio): void {
    this.estado = nuevoEstado;
  }

  // Validar datos
  validar(): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre es requerido');
    }

    if (this.costoUnitario < 0) {
      errores.push('El costo unitario no puede ser negativo');
    }

    if (this.cantidad < 1) {
      errores.push('La cantidad debe ser al menos 1');
    }

    if (this.pagosParciales < 0) {
      errores.push('Los pagos parciales no pueden ser negativos');
    }

    if (this.pagosParciales > this.costoTotal) {
      errores.push('Los pagos parciales no pueden exceder el costo total');
    }

    if (!['ARS', 'USD', 'EUR'].includes(this.moneda)) {
      errores.push('La moneda debe ser ARS, USD o EUR');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

