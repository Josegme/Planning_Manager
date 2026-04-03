export class Proveedor {
  constructor(
    public readonly id: string,
    public nombre: string,
    public servicioQuePresta: string | null,
    public contacto: string | null,
    public email: string | null,
    public telefono: string | null,
    public direccion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Validar datos
  validar(): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre es requerido');
    }

    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      errores.push('El email no tiene un formato válido');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}

