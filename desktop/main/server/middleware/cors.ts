import { Request, Response, NextFunction } from 'express';

/**
 * Middleware CORS para permitir conexiones desde red local
 * Configurado para permitir cualquier origen en red local (desarrollo y producción local)
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Permitir cualquier origen (en red local es seguro)
  // En producción, podrías restringir a IPs específicas
  const origin = req.headers.origin;
  
  // Permitir solicitudes sin origen (como Postman, curl, etc.)
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Headers permitidos
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
}
