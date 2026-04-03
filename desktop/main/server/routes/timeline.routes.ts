import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { SQLiteTimelineRepository } from '../../core/infrastructure/database/repositories/SQLiteTimelineRepository';
import { GetAllTimelineEtapasUseCase } from '../../core/application/use-cases/timeline/GetAllTimelineEtapasUseCase';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Inicializar repositorio y use cases (lazy initialization)
let timelineRepository: SQLiteTimelineRepository | null = null;
let getAllUseCase: GetAllTimelineEtapasUseCase | null = null;

function initializeTimelineRoutes() {
  if (timelineRepository) return; // Ya inicializado
  
  try {
    const db = getDatabase();
    timelineRepository = new SQLiteTimelineRepository(db);
    getAllUseCase = new GetAllTimelineEtapasUseCase(timelineRepository);
  } catch (error) {
    // Si la BD no está lista, se inicializará en el primer request
    console.warn('No se pudo inicializar timeline routes, se intentará en el primer request');
  }
}

/**
 * GET /api/timeline/:eventoId
 * Obtiene todas las etapas del timeline de un evento
 */
router.get(
  '/:eventoId',
  asyncHandler(async (req, res) => {
    initializeTimelineRoutes(); // Lazy initialization
    if (!getAllUseCase) {
      throw new Error('Timeline routes no inicializadas');
    }

    const { eventoId } = req.params;
    const eventoIdStr = Array.isArray(eventoId) ? eventoId[0] : eventoId;
    const etapas = await getAllUseCase.execute(eventoIdStr);

    res.json({
      success: true,
      data: etapas,
    });
  })
);

export default router;
