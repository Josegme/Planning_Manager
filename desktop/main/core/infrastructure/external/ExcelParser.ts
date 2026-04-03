import * as XLSX from 'xlsx';
import { ImportInvitadosDTO } from '../../application/dto/ImportInvitadosDTO';

export interface ExcelRow {
  dni?: string | number | null;
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  telefono?: string | number | null;
  grupo?: string | null;
  menu?: string | null;
  acompanantesEsperados?: string | number | null;
}

export class ExcelParser {
  /**
   * Parsea un archivo Excel y retorna los datos de invitados
   */
  static parseFile(filePath: string, eventoId: string): ImportInvitadosDTO {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      blankrows: false,
    });

    // Normalizar nombres de columnas (case-insensitive)
    const normalizedRows = rows.map(row => {
      const normalized: any = {};
      
      for (const [key, value] of Object.entries(row)) {
        const lowerKey = key.toLowerCase().trim();
        
        // Mapear diferentes variantes de nombres de columnas
        if (lowerKey.includes('dni') || lowerKey.includes('documento')) {
          normalized.dni = this.normalizeValue(value);
        } else if (lowerKey.includes('nombre') && !lowerKey.includes('apellido')) {
          normalized.nombre = this.normalizeValue(value);
        } else if (lowerKey.includes('apellido') || lowerKey.includes('apellidos')) {
          normalized.apellido = this.normalizeValue(value);
        } else if (lowerKey.includes('email') || lowerKey.includes('correo') || lowerKey.includes('mail')) {
          normalized.email = this.normalizeValue(value);
        } else if (lowerKey.includes('telefono') || lowerKey.includes('teléfono') || lowerKey.includes('celular')) {
          normalized.telefono = this.normalizeValue(value);
        } else if (lowerKey.includes('grupo') || lowerKey.includes('categoria')) {
          normalized.grupo = this.normalizeValue(value);
        } else if (lowerKey.includes('menu') || lowerKey.includes('menú')) {
          normalized.menu = this.normalizeValue(value);
        } else if (lowerKey.includes('acompanante') || lowerKey.includes('acompañante')) {
          normalized.acompanantesEsperados = this.normalizeNumber(value);
        }
      }
      
      return normalized;
    });

    // Filtrar filas vacías y validar que tengan nombre y apellido
    const invitadosValidos = normalizedRows
      .filter(row => row.nombre || row.apellido)
      .map(row => ({
        dni: row.dni || null,
        nombre: row.nombre || '',
        apellido: row.apellido || '',
        email: row.email || null,
        telefono: row.telefono || null,
        grupo: row.grupo || null,
        menu: row.menu || null,
        acompanantesEsperados: row.acompanantesEsperados || 0,
      }));

    return {
      eventoId,
      invitados: invitadosValidos,
    };
  }

  /**
   * Normaliza un valor a string o null
   */
  private static normalizeValue(value: any): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value.trim() || null;
    if (typeof value === 'number') return value.toString().trim();
    return String(value).trim() || null;
  }

  /**
   * Normaliza un valor a número
   */
  private static normalizeNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return Math.max(0, value);
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }

  /**
   * Genera un template Excel descargable
   */
  static generateTemplate(filePath: string): void {
    const templateData = [
      {
        'DNI': '',
        'Nombre': 'Ejemplo',
        'Apellido': 'Apellido',
        'Email': 'ejemplo@email.com',
        'Teléfono': '1234567890',
        'Grupo': 'Familia',
        'Menú': 'Vegetariano',
        'Acompañantes Esperados': 0,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados');
    XLSX.writeFile(workbook, filePath);
  }

  /**
   * Exporta una lista de invitados a Excel
   */
  static exportInvitados(filePath: string, invitados: any[]): void {
    const exportData = invitados.map(inv => ({
      'DNI': inv.dni || '',
      'Nombre': inv.nombre || '',
      'Apellido': inv.apellido || '',
      'Email': inv.email || '',
      'Teléfono': inv.telefono || '',
      'Grupo': inv.grupo || '',
      'Menú': inv.menu || '',
      'Mesa': inv.mesaId ? `Mesa ${inv.mesaNumero || ''}` : '',
      'Estado': inv.estado === 'pendiente' ? 'Pendiente' : 
                inv.estado === 'confirmado' ? 'Confirmado' : 
                inv.estado === 'cancelado' ? 'Cancelado' : '',
      'Acompañantes Esperados': inv.acompanantesEsperados || 0,
      'Acompañantes Reales': inv.acompanantesReales || 0,
      'QR Code': inv.qrCode || '',
      'Check-in': inv.checkinAt ? new Date(inv.checkinAt).toLocaleString('es-AR') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 12 }, // DNI
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido
      { wch: 25 }, // Email
      { wch: 15 }, // Teléfono
      { wch: 15 }, // Grupo
      { wch: 15 }, // Menú
      { wch: 10 }, // Mesa
      { wch: 12 }, // Estado
      { wch: 8 },  // Acompañantes Esperados
      { wch: 8 },  // Acompañantes Reales
      { wch: 30 }, // QR Code
      { wch: 20 }, // Check-in
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados');
    XLSX.writeFile(workbook, filePath);
  }

  /**
   * Exporta la lista de proveedores a Excel
   */
  static exportProveedores(filePath: string, proveedores: any[]): void {
    const exportData = proveedores.map(p => ({
      'Nombre': p.nombre || '',
      'Servicio que presta': p.servicioQuePresta || '',
      'Contacto': p.contacto || '',
      'Email': p.email || '',
      'Teléfono': p.telefono || '',
      'Dirección': p.direccion || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 28 }, { wch: 14 }, { wch: 30 },
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');
    XLSX.writeFile(workbook, filePath);
  }

  /** Columnas esperadas para importar planilla de servicios (al menos Servicio y Costo unit. o Total) */
  static readonly SERVICIOS_IMPORT_HEADERS = ['Servicio', 'Proveedor', 'Detalle', 'Costo unit.', 'Cant.', 'Total', 'Moneda', 'Estado', 'Contacto'] as const;

  /**
   * Exporta la planilla de servicios (calculos) a Excel
   */
  static exportServicios(filePath: string, servicios: any[], proveedores: any[]): void {
    const proveedorMap = new Map<string, { nombre: string; contacto: string }>();
    (proveedores || []).forEach((p: any) => {
      const contacto = [p.telefono, p.email].filter(Boolean).join(' · ') || p.contacto || '';
      proveedorMap.set(p.id, { nombre: p.nombre || '', contacto });
    });

    const exportData = servicios.map((s: any) => {
      const prov = s.proveedorId ? proveedorMap.get(s.proveedorId) : null;
      const pendiente = (s.costoTotal ?? 0) - (s.pagosParciales ?? 0);
      return {
        'Servicio': s.nombre || '',
        'Proveedor': prov?.nombre ?? '-',
        'Detalle': s.descripcion ?? '',
        'Costo unit.': s.costoUnitario ?? 0,
        'Cant.': s.cantidad ?? 1,
        'Total': s.costoTotal ?? 0,
        'Moneda': s.moneda ?? 'ARS',
        'Estado': s.estado === 'cotizado' ? 'Cotizado' : s.estado === 'contratado' ? 'Contratado' : s.estado === 'pagado' ? 'Pagado' : s.estado === 'cancelado' ? 'Cancelado' : '',
        'Pagado': s.pagosParciales ?? 0,
        'Pendiente': pendiente,
        'Contacto': prov?.contacto ?? '-',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 18 }, { wch: 18 }, { wch: 24 }, { wch: 12 }, { wch: 6 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 28 },
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');
    XLSX.writeFile(workbook, filePath);
  }

  /**
   * Parsea un Excel de planilla de servicios. Estructura esperada: Servicio (o Nombre), Proveedor (opcional), Detalle, Costo unit. (o Total), Cant., Moneda, Estado.
   */
  static parseServicios(filePath: string, eventoId: string): { eventoId: string; filas: ImportServicioRow[] } {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: null, blankrows: false });

    if (!rows.length) {
      throw new Error('El archivo no tiene filas de datos. Use la plantilla de servicios.');
    }

    const filas: ImportServicioRow[] = [];
    for (const row of rows) {
      const normalized: any = {};
      for (const [key, value] of Object.entries(row)) {
        const k = String(key).toLowerCase().trim();
        if (k.includes('servicio') || (k.includes('nombre') && !k.includes('proveedor'))) normalized.nombre = this.normalizeValue(value);
        else if (k.includes('proveedor')) normalized.proveedorNombre = this.normalizeValue(value);
        else if (k.includes('detalle') || k.includes('descripcion')) normalized.descripcion = this.normalizeValue(value);
        else if (k.includes('costo') && k.includes('unit')) normalized.costoUnitario = this.normalizeNumber(value);
        else if (k.includes('cant')) normalized.cantidad = this.normalizeNumber(value);
        else if (k === 'total') normalized.total = this.normalizeNumber(value);
        else if (k.includes('moneda')) normalized.moneda = this.normalizeValue(value) || 'ARS';
        else if (k.includes('estado')) normalized.estado = this.normalizeValue(value);
      }

      const nombre = (normalized.nombre != null && String(normalized.nombre).trim() !== '') ? String(normalized.nombre).trim() : null;
      if (!nombre) continue;

      const costoUnitario = normalized.costoUnitario != null ? Number(normalized.costoUnitario) : null;
      const total = normalized.total != null ? Number(normalized.total) : null;
      const cantidad = normalized.cantidad != null && normalized.cantidad > 0 ? Number(normalized.cantidad) : 1;
      if (costoUnitario == null && total == null) continue;
      const costoUnit = costoUnitario != null ? costoUnitario : (total != null ? total / cantidad : 0);

      filas.push({
        nombre,
        descripcion: normalized.descripcion || null,
        proveedorNombre: normalized.proveedorNombre || null,
        costoUnitario: costoUnit,
        cantidad,
        moneda: normalized.moneda || 'ARS',
        estado: normalized.estado || null,
      });
    }

    if (filas.length === 0) {
      throw new Error('No se encontraron filas válidas. Debe haber al menos columna "Servicio" y "Costo unit." o "Total".');
    }

    return { eventoId, filas };
  }

  /**
   * Genera plantilla Excel para planilla de servicios
   */
  static generateTemplateServicios(filePath: string): void {
    const templateData = [
      {
        'Servicio': 'Catering',
        'Proveedor': 'Proveedor Ejemplo',
        'Detalle': 'Servicio completo',
        'Costo unit.': 100000,
        'Cant.': 1,
        'Total': 100000,
        'Moneda': 'ARS',
        'Estado': 'Cotizado',
        'Contacto': '',
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');
    XLSX.writeFile(workbook, filePath);
  }
}

export interface ImportServicioRow {
  nombre: string;
  descripcion: string | null;
  proveedorNombre: string | null;
  costoUnitario: number;
  cantidad: number;
  moneda: string;
  estado: string | null;
}

