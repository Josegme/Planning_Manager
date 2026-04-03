import { useState, useEffect, useCallback } from 'react';
import { proveedoresApi } from '../services/api/proveedores.api';
import { Proveedor, CreateProveedorDTO, UpdateProveedorDTO } from '@shared/types/Proveedor';

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedoresApi.getAll();
      setProveedores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProveedores();
  }, [loadProveedores]);

  const createProveedor = useCallback(async (dto: CreateProveedorDTO): Promise<Proveedor> => {
    try {
      const proveedor = await proveedoresApi.create(dto);
      await loadProveedores();
      return proveedor;
    } catch (err) {
      throw err;
    }
  }, [loadProveedores]);

  const updateProveedor = useCallback(async (dto: UpdateProveedorDTO): Promise<Proveedor> => {
    try {
      const proveedor = await proveedoresApi.update(dto);
      await loadProveedores();
      return proveedor;
    } catch (err) {
      throw err;
    }
  }, [loadProveedores]);

  const deleteProveedor = useCallback(async (id: string): Promise<void> => {
    try {
      await proveedoresApi.delete(id);
      await loadProveedores();
    } catch (err) {
      throw err;
    }
  }, [loadProveedores]);

  return {
    proveedores,
    loading,
    error,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    refetch: loadProveedores,
  };
}

