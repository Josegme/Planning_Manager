export enum EstadoTimelineEtapa {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en_curso',
  COMPLETADO = 'completado',
}

export class TimelineEtapa {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public nombre: string,
    public descripcion: string | null,
    public horaPlanificada: string, // Formato HH:mm
    public duracionEstimada: number | null, // En minutos
    public estado: EstadoTimelineEtapa,
    public horaInicioReal: Date | null,
    public horaFinReal: Date | null,
    public retrasoMinutos: number,
    public orden: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Marcar etapa como completada
  marcarCompletada(): void {
    this.estado = EstadoTimelineEtapa.COMPLETADO;
    if (!this.horaFinReal) {
      this.horaFinReal = new Date();
    }
    this.calcularRetraso();
  }

  // Registrar hora de inicio real
  registrarInicio(): void {
    this.estado = EstadoTimelineEtapa.EN_CURSO;
    this.horaInicioReal = new Date();
    this.calcularRetraso();
  }

  // Registrar hora de fin real
  registrarFin(): void {
    this.horaFinReal = new Date();
    this.estado = EstadoTimelineEtapa.COMPLETADO;
    this.calcularRetraso();
  }

  // Calcular retraso automáticamente
  calcularRetraso(): void {
    if (!this.horaInicioReal) {
      this.retrasoMinutos = 0;
      return;
    }

    const horaPlanificadaDate = this.parseHoraPlanificada();
    if (!horaPlanificadaDate) {
      this.retrasoMinutos = 0;
      return;
    }

    const diferencia = this.horaInicioReal.getTime() - horaPlanificadaDate.getTime();
    this.retrasoMinutos = Math.max(0, Math.round(diferencia / (1000 * 60)));
  }

  // Agregar retraso manual
  agregarRetrasoManual(minutos: number): void {
    this.retrasoMinutos = Math.max(0, minutos);
  }

  // Parsear hora planificada a Date (usando fecha del evento)
  private parseHoraPlanificada(): Date | null {
    try {
      const [horas, minutos] = this.horaPlanificada.split(':').map(Number);
      if (isNaN(horas) || isNaN(minutos)) return null;
      
      // Usar fecha actual como base (en producción se usaría la fecha del evento)
      const fecha = new Date();
      fecha.setHours(horas, minutos, 0, 0);
      return fecha;
    } catch {
      return null;
    }
  }

  // Obtener color de estado según retraso
  getColorEstado(): 'verde' | 'amarillo' | 'rojo' {
    if (this.estado === EstadoTimelineEtapa.COMPLETADO && this.retrasoMinutos === 0) {
      return 'verde';
    }
    if (this.retrasoMinutos > 0 && this.retrasoMinutos <= 15) {
      return 'amarillo';
    }
    if (this.retrasoMinutos > 15) {
      return 'rojo';
    }
    return 'verde';
  }

  // Validar datos
  validar(): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre es requerido');
    }

    if (!this.horaPlanificada || !/^\d{2}:\d{2}$/.test(this.horaPlanificada)) {
      errores.push('La hora planificada debe tener formato HH:mm');
    }

    if (this.duracionEstimada !== null && this.duracionEstimada < 0) {
      errores.push('La duración estimada no puede ser negativa');
    }

    if (this.orden < 0) {
      errores.push('El orden no puede ser negativo');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

