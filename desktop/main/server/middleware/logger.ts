import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de logging para requests HTTP
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log del request
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);

  // Log del response cuando termine
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}
