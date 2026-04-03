export enum EstadoEvento {
  PLANIFICACION = 'planificacion',
  ACTIVO = 'activo',
  FINALIZADO = 'finalizado',
}

export class Evento {
  constructor(
    public id: string,
    public nombre: string,
    public tipo: string | null,
    public fecha: string, // ISO date string
    public hora: string | null,
    public lugar: string | null,
    public descripcion: string | null,
    public estado: EstadoEvento,
    public tieneMesas: boolean,
    public cantidadMesas: number,
    public capacidadMesa: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    nombre: string,
    tipo: string | null,
    fecha: string,
    hora: string | null,
    lugar: string | null,
    descripcion: string | null,
    tieneMesas: boolean,
    cantidadMesas: number,
    capacidadMesa: number
  ): Evento {
    const now = new Date();
    const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return new Evento(
      id,
      nombre,
      tipo,
      fecha,
      hora,
      lugar,
      descripcion,
      EstadoEvento.PLANIFICACION,
      tieneMesas,
      cantidadMesas,
      capacidadMesa,
      now,
      now
    );
  }

  cambiarEstado(nuevoEstado: EstadoEvento): void {
    this.estado = nuevoEstado;
    this.updatedAt = new Date();
  }

  actualizar(
    nombre?: string,
    tipo?: string | null,
    fecha?: string,
    hora?: string | null,
    lugar?: string | null,
    descripcion?: string | null,
    cantidadMesas?: number,
    capacidadMesa?: number
  ): void {
    if (nombre !== undefined) this.nombre = nombre;
    if (tipo !== undefined) this.tipo = tipo;
    if (fecha !== undefined) this.fecha = fecha;
    if (hora !== undefined) this.hora = hora;
    if (lugar !== undefined) this.lugar = lugar;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (cantidadMesas !== undefined) this.cantidadMesas = cantidadMesas;
    if (capacidadMesa !== undefined) this.capacidadMesa = capacidadMesa;
    this.updatedAt = new Date();
  }

  puedeEliminarse(): boolean {
    // Solo se puede eliminar si está en planificación
    return this.estado === EstadoEvento.PLANIFICACION;
  }

  puedeEditarse(): boolean {
    // No se puede editar si está finalizado
    return this.estado !== EstadoEvento.FINALIZADO;
  }
}

