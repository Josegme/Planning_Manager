import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { asyncHandler } from '../middleware/errorHandler';
import Database from 'better-sqlite3';

const router = Router();

interface Mesa {
  id: string;
  eventoId: string;
  numero: number;
  capacidad: number;
  ubicacion: string | null;
}

/**
 * GET /api/mesas/:eventoId
 * Obtiene todas las mesas de un evento
 */
router.get(
  '/:eventoId',
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    const { eventoId } = req.params;
    const eventoIdStr = Array.isArray(eventoId) ? eventoId[0] : eventoId;

    const rows = db
      .prepare('SELECT * FROM mesas WHERE evento_id = ? ORDER BY numero')
      .all(eventoIdStr) as any[];

    const mesas: Mesa[] = rows.map((row) => ({
      id: row.id,
      eventoId: row.evento_id,
      numero: row.numero,
      capacidad: row.capacidad,
      ubicacion: row.ubicacion,
    }));

    res.json({
      success: true,
      data: mesas,
    });
  })
);

export default router;
