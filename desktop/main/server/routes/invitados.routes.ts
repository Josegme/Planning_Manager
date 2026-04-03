import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { SQLiteInvitadoRepository } from '../../core/infrastructure/database/repositories/SQLiteInvitadoRepository';
import { GetAllInvitadosUseCase } from '../../core/application/use-cases/invitados/GetAllInvitadosUseCase';
import { GetInvitadoUseCase } from '../../core/application/use-cases/invitados/GetInvitadoUseCase';
import { CheckInInvitadoUseCase } from '../../core/application/use-cases/invitados/CheckInInvitadoUseCase';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Inicializar repositorio y use cases (lazy initialization)
let invitadoRepository: SQLiteInvitadoRepository | null = null;
let getAllUseCase: GetAllInvitadosUseCase | null = null;
let getUseCase: GetInvitadoUseCase | null = null;
let checkInUseCase: CheckInInvitadoUseCase | null = null;

function initializeInvitadosRoutes() {
  if (invitadoRepository) return; // Ya inicializado
  
  try {
    const db = getDatabase();
    invitadoRepository = new SQLiteInvitadoRepository(db);
    getAllUseCase = new GetAllInvitadosUseCase(invitadoRepository);
    getUseCase = new GetInvitadoUseCase(invitadoRepository);
    checkInUseCase = new CheckInInvitadoUseCase(invitadoRepository);
  } catch (error) {
    // Si la BD no está lista, se inicializará en el primer request
    console.warn('No se pudo inicializar invitados routes, se intentará en el primer request');
  }
}

/**
 * GET /api/invitados/:eventoId
 * Obtiene todos los invitados de un evento
 */
router.get(
  '/:eventoId',
  asyncHandler(async (req, res) => {
    initializeInvitadosRoutes(); // Lazy initialization
    if (!getAllUseCase) {
      throw new Error('Invitados routes no inicializadas');
    }

    const { eventoId } = req.params;
    const eventoIdStr = Array.isArray(eventoId) ? eventoId[0] : eventoId;
    const invitados = await getAllUseCase.execute(eventoIdStr);

    res.json({
      success: true,
      data: invitados,
    });
  })
);

/**
 * GET /api/invitados/findByQR/:codigoQR/:eventoId
 * Busca un invitado por código QR
 */
router.get(
  '/findByQR/:codigoQR/:eventoId',
  asyncHandler(async (req, res) => {
    initializeInvitadosRoutes(); // Lazy initialization
    if (!invitadoRepository) {
      throw new Error('Invitados routes no inicializadas');
    }

    const { codigoQR, eventoId } = req.params;
    const codigoQRStr = Array.isArray(codigoQR) ? codigoQR[0] : codigoQR;
    const eventoIdStr = Array.isArray(eventoId) ? eventoId[0] : eventoId;

    // Buscar invitado por QR code en el evento
    const invitados = await invitadoRepository.findByEventoId(eventoIdStr);
    const invitado = invitados.find((inv) => inv.qrCode === codigoQRStr);

    if (!invitado) {
      return res.status(404).json({
        success: false,
        error: 'Invitado no encontrado con ese código QR',
      });
    }

    res.json({
      success: true,
      data: invitado,
    });
  })
);

/**
 * POST /api/invitados/checkin
 * Procesa un check-in recibido desde el cliente
 * Body: { invitadoId: string, acompanantesReales?: number }
 */
router.post(
  '/checkin',
  asyncHandler(async (req, res) => {
    initializeInvitadosRoutes(); // Lazy initialization
    if (!checkInUseCase) {
      throw new Error('Invitados routes no inicializadas');
    }

    const { invitadoId, acompanantesReales } = req.body;

    if (!invitadoId) {
      return res.status(400).json({
        success: false,
        error: 'invitadoId es requerido',
      });
    }

    const acompanantes = acompanantesReales || 0;
    const invitado = await checkInUseCase.execute(invitadoId, acompanantes);

    res.json({
      success: true,
      data: invitado,
    });
  })
);

export default router;
