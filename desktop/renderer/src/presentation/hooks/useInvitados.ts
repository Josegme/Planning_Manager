import { useState, useEffect, useCallback } from 'react';
import { Invitado, CreateInvitadoDTO, UpdateInvitadoDTO } from '@shared/types/Invitado';
import { invitadosApi } from '../services/api/invitados.api';

export function useInvitados(eventoId: string | null) {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitados = useCallback(async () => {
    if (!eventoId) {
      setInvitados([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await invitadosApi.getAll(eventoId);
      setInvitados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar invitados');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchInvitados();
  }, [fetchInvitados]);

  const createInvitado = useCallback(async (dto: CreateInvitadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await invitadosApi.create(dto);
      setInvitados(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear invitado';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvitado = useCallback(async (dto: UpdateInvitadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await invitadosApi.update(dto);
      setInvitados(prev => prev.map(inv => inv.id === actualizado.id ? actualizado : inv));
      return actualizado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar invitado';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvitado = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await invitadosApi.delete(id);
      setInvitados(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar invitado';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIn = useCallback(async (id: string, acompanantesReales: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await invitadosApi.checkIn(id, acompanantesReales);
      setInvitados(prev => prev.map(inv => inv.id === actualizado.id ? actualizado : inv));
      return actualizado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al hacer check-in';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invitados,
    loading,
    error,
    createInvitado,
    updateInvitado,
    deleteInvitado,
    checkIn,
    refetch: fetchInvitados,
  };
}

