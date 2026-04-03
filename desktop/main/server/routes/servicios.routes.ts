import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { SQLiteServicioRepository } from '../../core/infrastructure/database/repositories/SQLiteServicioRepository';
import { GetAllServiciosUseCase } from '../../core/application/use-cases/servicios/GetAllServiciosUseCase';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Inicializar repositorio y use cases (lazy initialization)
let servicioRepository: SQLiteServicioRepository | null = null;
let getAllUseCase: GetAllServiciosUseCase | null = null;

function initializeServiciosRoutes() {
  if (servicioRepository) return; // Ya inicializado
  
  try {
    const db = getDatabase();
    servicioRepository = new SQLiteServicioRepository(db);
    getAllUseCase = new GetAllServiciosUseCase(servicioRepository);
  } catch (error) {
    // Si la BD no está lista, se inicializará en el primer request
    console.warn('No se pudo inicializar servicios routes, se intentará en el primer request');
  }
}

/**
 * GET /api/servicios/:eventoId
 * Obtiene todos los servicios de un evento
 */
router.get(
  '/:eventoId',
  asyncHandler(async (req, res) => {
    initializeServiciosRoutes(); // Lazy initialization
    if (!getAllUseCase) {
      throw new Error('Servicios routes no inicializadas');
    }

    const { eventoId } = req.params;
    const eventoIdStr = Array.isArray(eventoId) ? eventoId[0] : eventoId;
    const servicios = await getAllUseCase.execute(eventoIdStr);

    res.json({
      success: true,
      data: servicios,
    });
  })
);

export default router;
