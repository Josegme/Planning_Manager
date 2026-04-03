import express, { Express } from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import eventosRoutes from './routes/eventos.routes';
import invitadosRoutes from './routes/invitados.routes';
import mesasRoutes from './routes/mesas.routes';
import timelineRoutes from './routes/timeline.routes';
import serviciosRoutes from './routes/servicios.routes';

let server: Express | null = null;
let httpServer: any = null;
const PORT = 8080;

/**
 * Inicia el servidor HTTP local
 */
export function startServer(): Promise<{ success: boolean; port: number; ip: string | null; error?: string }> {
  return new Promise((resolve) => {
    try {
      if (httpServer) {
        resolve({
          success: false,
          port: PORT,
          ip: null,
          error: 'El servidor ya está corriendo',
        });
        return;
      }

      server = express();

      // Middleware
      server.use(express.json());
      server.use(corsMiddleware);
      server.use(loggerMiddleware);

      // Rutas
      server.use('/api/eventos', eventosRoutes);
      server.use('/api/invitados', invitadosRoutes);
      server.use('/api/mesas', mesasRoutes);
      server.use('/api/timeline', timelineRoutes);
      server.use('/api/servicios', serviciosRoutes);

      // Ruta de health check
      server.get('/api/health', (req: express.Request, res: express.Response) => {
        res.json({
          success: true,
          message: 'Planning Manager Server está funcionando',
          timestamp: new Date().toISOString(),
        });
      });

      // Manejo de errores (debe ir al final)
      server.use(errorHandler);

      // Iniciar servidor
      httpServer = server.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Servidor HTTP iniciado en puerto ${PORT}`);
        console.log(`   Accesible en: http://0.0.0.0:${PORT}`);
        
        const { getLocalIP } = require('./utils/networkUtils');
        const ip = getLocalIP();
        
        if (ip) {
          console.log(`   IP local: http://${ip}:${PORT}`);
        }

        resolve({
          success: true,
          port: PORT,
          ip: ip || null,
        });
      });

      httpServer.on('error', (err: any) => {
        console.error('❌ Error al iniciar servidor HTTP:', err);
        httpServer = null;
        server = null;
        resolve({
          success: false,
          port: PORT,
          ip: null,
          error: err.message || 'Error desconocido',
        });
      });
    } catch (error) {
      console.error('❌ Error al configurar servidor:', error);
      resolve({
        success: false,
        port: PORT,
        ip: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  });
}

/**
 * Detiene el servidor HTTP
 */
export function stopServer(): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!httpServer) {
      resolve({
        success: false,
        error: 'El servidor no está corriendo',
      });
      return;
    }

    httpServer.close((err: any) => {
      if (err) {
        console.error('❌ Error al detener servidor:', err);
        resolve({
          success: false,
          error: err.message || 'Error al detener servidor',
        });
        return;
      }

      console.log('✅ Servidor HTTP detenido');
      httpServer = null;
      server = null;
      resolve({ success: true });
    });
  });
}

/**
 * Obtiene el estado del servidor
 */
export function getServerStatus(): { isRunning: boolean; port: number } {
  return {
    isRunning: httpServer !== null,
    port: PORT,
  };
}
