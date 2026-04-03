import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { initializeDatabase } from './database/connection';
import { initializeEventosHandlers } from './handlers/eventosHandler';
import { initializeInvitadosHandlers } from './handlers/invitadosHandler';
import { initializeExcelHandlers } from './handlers/excelHandler';
import { initializeMesasHandlers } from './handlers/mesasHandler';
import { initializeTimelineHandlers } from './handlers/timelineHandler';
import { initializeServiciosHandlers } from './handlers/serviciosHandler';
import { initializeProveedoresHandlers } from './handlers/proveedoresHandler';
import { initializeSyncHandlers } from './handlers/syncHandler';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('📦 Cargando preload desde:', preloadPath);
  console.log('📦 __dirname:', __dirname);
  console.log('📦 preload.js existe:', require('fs').existsSync(preloadPath));
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      // En desarrollo, esperar a que Vite esté listo
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // Verificar que el preload se cargó correctamente
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.executeJavaScript(`
      console.log('🔍 Verificando electronAPI...');
      console.log('window.electronAPI:', typeof window.electronAPI !== 'undefined' ? '✅ Disponible' : '❌ No disponible');
      if (typeof window.electronAPI === 'undefined') {
        console.error('❌ ERROR: electronAPI no está disponible. Verifica preload.js');
      }
    `).catch((err: any) => console.error('Error ejecutando script de verificación:', err));
  });

  const isProduction = app.isPackaged || process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Producción: cargar el HTML compilado del renderer desde el sistema de archivos
    const rendererPath = path.join(__dirname, '..', 'renderer', 'dist', 'index.html');
    mainWindow.loadFile(rendererPath);
    console.log('✅ Cargando aplicación desde archivo:', rendererPath);
  } else {
    // Desarrollo: cargar desde Vite dev server
    const findVitePort = (startPort: number = 5173, maxPort: number = 5180): Promise<number> => {
      return new Promise((resolve, reject) => {
        const http = require('http');
        const tryPort = (port: number) => {
          const req = http.get(`http://localhost:${port}`, () => {
            console.log(`✅ Vite encontrado en puerto ${port}`);
            resolve(port);
          });
          req.on('error', () => {
            if (port < maxPort) tryPort(port + 1);
            else reject(new Error(`No se encontró Vite en puertos ${startPort}-${maxPort}`));
          });
        };
        tryPort(startPort);
      });
    };

    findVitePort()
      .then((port) => {
        if (mainWindow) {
          mainWindow.loadURL(`http://localhost:${port}`);
          mainWindow.webContents.openDevTools();
        }
      })
      .catch((err) => {
        console.error('❌ Error al encontrar Vite:', err);
        setTimeout(() => {
          findVitePort()
            .then((port) => { if (mainWindow) mainWindow.loadURL(`http://localhost:${port}`); })
            .catch(() => console.error('❌ No se pudo conectar a Vite.'));
        }, 2000);
      });

    mainWindow.webContents.on('did-fail-load', (_event, errorCode) => {
      if ((errorCode === -106 || errorCode === -3) && mainWindow) {
        setTimeout(() => {
          findVitePort()
            .then((port) => { if (mainWindow) mainWindow.loadURL(`http://localhost:${port}`); })
            .catch(() => {});
        }, 2000);
      }
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Inicializar base de datos
  await initializeDatabase();
  
  // Inicializar handlers IPC
  initializeEventosHandlers();
  initializeInvitadosHandlers();
  initializeExcelHandlers();
  initializeMesasHandlers();
  initializeTimelineHandlers();
  initializeServiciosHandlers();
  initializeProveedoresHandlers();
  initializeSyncHandlers();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

