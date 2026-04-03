import { useState, useEffect, useCallback } from 'react';
import { timelineApi } from '../services/api/timeline.api';
import { TimelineEtapa, CreateTimelineEtapaDTO, UpdateTimelineEtapaDTO } from '@shared/types/Timeline';

export function useTimeline(eventoId: string) {
  const [etapas, setEtapas] = useState<TimelineEtapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEtapas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await timelineApi.getAll(eventoId);
      setEtapas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar etapas');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    loadEtapas();
  }, [loadEtapas]);

  const createEtapa = useCallback(async (dto: CreateTimelineEtapaDTO): Promise<TimelineEtapa> => {
    try {
      const etapa = await timelineApi.create(dto);
      await loadEtapas();
      return etapa;
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  const updateEtapa = useCallback(async (dto: UpdateTimelineEtapaDTO): Promise<TimelineEtapa> => {
    try {
      const etapa = await timelineApi.update(dto);
      await loadEtapas();
      return etapa;
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  const deleteEtapa = useCallback(async (id: string): Promise<void> => {
    try {
      await timelineApi.delete(id);
      await loadEtapas();
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  const marcarCompletada = useCallback(async (id: string): Promise<TimelineEtapa> => {
    try {
      const etapa = await timelineApi.marcarCompletada(id);
      await loadEtapas();
      return etapa;
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  const registrarTiempoReal = useCallback(async (id: string, horaInicio?: Date, horaFin?: Date): Promise<TimelineEtapa> => {
    try {
      const etapa = await timelineApi.registrarTiempoReal(id, horaInicio, horaFin);
      await loadEtapas();
      return etapa;
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  const reordenarEtapas = useCallback(async (etapasOrdenadas: { id: string; orden: number }[]): Promise<void> => {
    try {
      await timelineApi.reordenar(etapasOrdenadas);
      await loadEtapas();
    } catch (err) {
      throw err;
    }
  }, [loadEtapas]);

  return {
    etapas,
    loading,
    error,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    marcarCompletada,
    registrarTiempoReal,
    reordenarEtapas,
    refetch: loadEtapas,
  };
}

