import { useState, useEffect, useCallback } from 'react';
import { Evento, EstadoEvento } from '@shared/types/Evento';
import { CreateEventoDTO, UpdateEventoDTO } from '@shared/types/DTOs';
import { EventosAPI } from '../services/api/eventos.api';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [hiddenEventos, setHiddenEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventosAPI.getAll();
      setEventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
      console.error('Error loading eventos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEventos();
  }, [loadEventos]);

  const createEvento = useCallback(async (dto: CreateEventoDTO): Promise<Evento> => {
    try {
      setError(null);
      const nuevoEvento = await EventosAPI.create(dto);
      setEventos(prev => [nuevoEvento, ...prev]);
      return nuevoEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear evento';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateEvento = useCallback(async (dto: UpdateEventoDTO): Promise<Evento> => {
    try {
      setError(null);
      const eventoActualizado = await EventosAPI.update(dto);
      setEventos(prev =>
        prev.map(e => (e.id === eventoActualizado.id ? eventoActualizado : e))
      );
      return eventoActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar evento';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteEvento = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await EventosAPI.delete(id);
      setEventos(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar evento';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const changeEstado = useCallback(async (id: string, estado: EstadoEvento): Promise<Evento> => {
    try {
      setError(null);
      const eventoActualizado = await EventosAPI.changeEstado(id, estado);
      setEventos(prev =>
        prev.map(e => (e.id === eventoActualizado.id ? eventoActualizado : e))
      );
      return eventoActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loadHiddenEventos = useCallback(async () => {
    try {
      const data = await EventosAPI.getHidden();
      setHiddenEventos(data);
    } catch (err) {
      console.error('Error loading hidden eventos:', err);
    }
  }, []);

  const softDeleteEvento = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await EventosAPI.softDelete(id);
      setEventos(prev => prev.filter(e => e.id !== id));
      await loadHiddenEventos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al ocultar evento';
      setError(errorMessage);
      throw err;
    }
  }, [loadHiddenEventos]);

  const recoverEvento = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await EventosAPI.recover(id);
      setHiddenEventos(prev => prev.filter(e => e.id !== id));
      await loadEventos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al recuperar evento';
      setError(errorMessage);
      throw err;
    }
  }, [loadEventos]);

  useEffect(() => {
    loadHiddenEventos();
  }, [loadHiddenEventos]);

  return {
    eventos,
    hiddenEventos,
    loading,
    error,
    loadEventos,
    loadHiddenEventos,
    createEvento,
    updateEvento,
    deleteEvento,
    softDeleteEvento,
    recoverEvento,
    changeEstado,
  };
}

