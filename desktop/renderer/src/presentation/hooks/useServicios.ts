import { useState, useEffect, useCallback } from 'react';
import { serviciosApi } from '../services/api/servicios.api';
import { Servicio, CreateServicioDTO, UpdateServicioDTO } from '@shared/types/Servicio';

export function useServicios(eventoId: string) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviciosApi.getAll(eventoId);
      setServicios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    loadServicios();
  }, [loadServicios]);

  const createServicio = useCallback(async (dto: CreateServicioDTO): Promise<Servicio> => {
    try {
      const servicio = await serviciosApi.create(dto);
      await loadServicios();
      return servicio;
    } catch (err) {
      throw err;
    }
  }, [loadServicios]);

  const updateServicio = useCallback(async (dto: UpdateServicioDTO): Promise<Servicio> => {
    try {
      const servicio = await serviciosApi.update(dto);
      await loadServicios();
      return servicio;
    } catch (err) {
      throw err;
    }
  }, [loadServicios]);

  const deleteServicio = useCallback(async (id: string): Promise<void> => {
    try {
      await serviciosApi.delete(id);
      await loadServicios();
    } catch (err) {
      throw err;
    }
  }, [loadServicios]);

  return {
    servicios,
    loading,
    error,
    createServicio,
    updateServicio,
    deleteServicio,
    refetch: loadServicios,
  };
}

