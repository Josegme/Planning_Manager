import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { SQLiteEventoRepository } from '../../core/infrastructure/database/repositories/SQLiteEventoRepository';
import { GetAllEventosUseCase } from '../../core/application/use-cases/eventos/GetAllEventosUseCase';
import { GetEventoUseCase } from '../../core/application/use-cases/eventos/GetEventoUseCase';
import { EstadoEvento } from '../../core/domain/entities/Evento';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Inicializar repositorio y use cases (lazy initialization)
let eventoRepository: SQLiteEventoRepository | null = null;
let getAllUseCase: GetAllEventosUseCase | null = null;
let getUseCase: GetEventoUseCase | null = null;

function initializeEventosRoutes() {
  if (eventoRepository) return; // Ya inicializado
  
  try {
    const db = getDatabase();
    eventoRepository = new SQLiteEventoRepository(db);
    getAllUseCase = new GetAllEventosUseCase(eventoRepository);
    getUseCase = new GetEventoUseCase(eventoRepository);
  } catch (error) {
    // Si la BD no está lista, se inicializará en el primer request
    console.warn('No se pudo inicializar eventos routes, se intentará en el primer request');
  }
}

/**
 * GET /api/eventos
 * Obtiene todos los eventos activos (para modo recepción)
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    initializeEventosRoutes(); // Lazy initialization
    if (!getAllUseCase) {
      throw new Error('Eventos routes no inicializadas');
    }

    const eventos = await getAllUseCase.execute();
    // Filtrar solo eventos activos para modo recepción
    const eventosActivos = eventos.filter(e => e.estado === EstadoEvento.ACTIVO);
    
    res.json({
      success: true,
      data: eventosActivos,
    });
  })
);

/**
 * GET /api/eventos/:id
 * Obtiene un evento por ID
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    initializeEventosRoutes(); // Lazy initialization
    if (!getUseCase) {
      throw new Error('Eventos routes no inicializadas');
    }

    const { id } = req.params;
    const eventoId = Array.isArray(id) ? id[0] : id;
    const evento = await getUseCase.execute(eventoId);

    if (!evento) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado',
      });
    }

    res.json({
      success: true,
      data: evento,
    });
  })
);

export default router;
