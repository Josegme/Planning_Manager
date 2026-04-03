import { ipcMain, dialog } from 'electron';
import * as path from 'path';
import { app } from 'electron';
import { ExcelParser } from '../core/infrastructure/external/ExcelParser';
import { ImportInvitadosDTO } from '../core/application/dto/ImportInvitadosDTO';
import { getDatabase } from '../database/connection';

export function initializeExcelHandlers() {
  // Handler para seleccionar archivo Excel
  ipcMain.handle('excel:selectFile', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Seleccionar archivo Excel',
      filters: [
        { name: 'Excel', extensions: ['xlsx', 'xls'] },
        { name: 'Todos los archivos', extensions: ['*'] },
      ],
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No se seleccionó ningún archivo' };
    }

    return { success: true, filePath: result.filePaths[0] };
  });

  // Handler para parsear archivo Excel
  ipcMain.handle('excel:parseFile', async (_, filePath: string, eventoId: string) => {
    try {
      const dto = ExcelParser.parseFile(filePath, eventoId);
      return { success: true, data: dto };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al leer el archivo Excel',
      };
    }
  });

  // Handler para generar template Excel
  ipcMain.handle('excel:generateTemplate', async () => {
    try {
      const userDataPath = app.getPath('downloads');
      const templatePath = path.join(userDataPath, 'template_invitados.xlsx');
      
      ExcelParser.generateTemplate(templatePath);
      
      return { success: true, filePath: templatePath };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar template',
      };
    }
  });

  // Handler para exportar invitados a Excel
  ipcMain.handle('excel:exportInvitados', async (_, eventoId: string, invitados: any[], eventoNombre?: string) => {
    try {
      const db = getDatabase();
      
      // Enriquecer invitados con número de mesa
      const invitadosEnriquecidos = invitados.map(inv => {
        let mesaNumero = null;
        if (inv.mesaId) {
          const mesa = db.prepare('SELECT numero FROM mesas WHERE id = ?').get(inv.mesaId) as { numero: number } | undefined;
          if (mesa) {
            mesaNumero = mesa.numero;
          }
        }
        return {
          ...inv,
          mesaNumero,
        };
      });

      // Nombre de archivo intuitivo: {Evento}_Invitados_{dd-mm-yyyy}.xlsx
      const hoy = new Date();
      const dd = String(hoy.getDate()).padStart(2, '0');
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const yyyy = hoy.getFullYear();
      const fechaStr = `${dd}-${mm}-${yyyy}`;
      const baseNombre = eventoNombre
        ? eventoNombre.replace(/[^\w\s\u00C0-\u024F-]/gi, '').replace(/\s+/g, '_').trim() || 'Evento'
        : 'Evento';
      const nombreArchivo = `${baseNombre}_Invitados_${fechaStr}.xlsx`;

      const result = await dialog.showSaveDialog({
        title: 'Exportar Invitados a Excel',
        defaultPath: path.join(app.getPath('downloads'), nombreArchivo),
        filters: [
          { name: 'Excel', extensions: ['xlsx'] },
          { name: 'Todos los archivos', extensions: ['*'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: 'Operación cancelada' };
      }

      ExcelParser.exportInvitados(result.filePath, invitadosEnriquecidos);

      return { success: true, filePath: result.filePath };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al exportar invitados',
      };
    }
  });

  // Exportar planilla de servicios a Excel
  ipcMain.handle('excel:exportServicios', async (_, eventoId: string, servicios: any[], eventoNombre?: string, proveedores?: any[]) => {
    try {
      const hoy = new Date();
      const dd = String(hoy.getDate()).padStart(2, '0');
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const yyyy = hoy.getFullYear();
      const fechaStr = `${dd}-${mm}-${yyyy}`;
      const baseNombre = eventoNombre
        ? String(eventoNombre).replace(/[^\w\s\u00C0-\u024F-]/gi, '').replace(/\s+/g, '_').trim() || 'Evento'
        : 'Evento';
      const nombreArchivo = `${baseNombre}_Servicios_${fechaStr}.xlsx`;

      const result = await dialog.showSaveDialog({
        title: 'Exportar planilla de servicios a Excel',
        defaultPath: path.join(app.getPath('downloads'), nombreArchivo),
        filters: [
          { name: 'Excel', extensions: ['xlsx'] },
          { name: 'Todos los archivos', extensions: ['*'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: 'Operación cancelada' };
      }

      ExcelParser.exportServicios(result.filePath, servicios || [], proveedores || []);
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al exportar servicios',
      };
    }
  });

  // Parsear archivo Excel de planilla de servicios (para importar)
  ipcMain.handle('excel:parseFileServicios', async (_, filePath: string, eventoId: string) => {
    try {
      const data = ExcelParser.parseServicios(filePath, eventoId);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'El archivo no tiene la estructura esperada. Use la plantilla de servicios.',
      };
    }
  });

  // Generar plantilla Excel para planilla de servicios
  ipcMain.handle('excel:generateTemplateServicios', async () => {
    try {
      const userDataPath = app.getPath('downloads');
      const templatePath = path.join(userDataPath, 'plantilla_servicios.xlsx');
      ExcelParser.generateTemplateServicios(templatePath);
      return { success: true, filePath: templatePath };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar plantilla',
      };
    }
  });
}

