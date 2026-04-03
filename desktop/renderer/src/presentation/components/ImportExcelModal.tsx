import { useState } from 'react';
import { excelApi } from '../services/api/excel.api';
import { invitadosApi } from '../services/api/invitados.api';
import { ImportInvitadosDTO, ImportResult } from '@shared/types/Invitado';
import './Modal.css';

interface ImportExcelModalProps {
  eventoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface PreviewRow {
  index: number;
  data: any;
  errors: string[];
  edited: boolean;
}

export function ImportExcelModal({ eventoId, onClose, onSuccess }: ImportExcelModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ImportInvitadosDTO | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const validateRow = (row: Record<string, unknown>, _index: number): string[] => {
    const errors: string[] = [];
    const nombre = String(row.nombre ?? '').trim();
    const apellido = String(row.apellido ?? '').trim();
    if (!nombre) errors.push('Nombre requerido');
    if (!apellido) errors.push('Apellido requerido');
    if (row.dni != null && !/^\d{7,8}$/.test(String(row.dni).trim())) {
      errors.push('DNI inválido (debe tener 7 u 8 dígitos)');
    }
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email).trim())) {
      errors.push('Email inválido');
    }
    return errors;
  };

  const handleSelectFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const filePath = await excelApi.selectFile();
      const dto = await excelApi.parseFile(filePath, eventoId) as ImportInvitadosDTO;
      setPreviewData(dto);
      
      // Validar cada fila y crear preview rows
      const rows: PreviewRow[] = (dto as ImportInvitadosDTO).invitados.map((inv: ImportInvitadosDTO['invitados'][number], idx: number) => ({
        index: idx,
        data: inv,
        errors: validateRow(inv, idx),
        edited: false,
      }));
      setPreviewRows(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const filePath = await excelApi.generateTemplate();
      alert(`Template descargado en: ${filePath}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar template');
    }
  };

  const handleEditRow = (index: number, field: string, value: any) => {
    const newRows = [...previewRows];
    newRows[index] = {
      ...newRows[index],
      data: { ...newRows[index].data, [field]: value },
      edited: true,
      errors: validateRow({ ...newRows[index].data, [field]: value }, index),
    };
    setPreviewRows(newRows);
    
    // Actualizar previewData también
    if (previewData) {
      const newData = { ...previewData };
      newData.invitados[index] = newRows[index].data;
      setPreviewData(newData);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    // Usar datos editados si hay
    const dataToImport = previewRows.length > 0
      ? { ...previewData, invitados: previewRows.map(r => r.data) }
      : previewData;

    setLoading(true);
    setError(null);
    try {
      const result = await invitadosApi.import(dataToImport);
      setImportResult(result);
      
      if (result.errores.length === 0) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar invitados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Importar Invitados desde Excel</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {!previewData && !importResult && (
            <div>
              <p>Selecciona un archivo Excel para importar invitados.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleDownloadTemplate}>
                  📥 Descargar Template
                </button>
                <button className="btn-primary" onClick={handleSelectFile} disabled={loading}>
                  {loading ? 'Cargando...' : 'Seleccionar Archivo'}
                </button>
              </div>
            </div>
          )}

          {previewData && previewRows.length > 0 && !importResult && (
            <div>
              <h3>Vista Previa ({previewRows.length} invitados)</h3>
              <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                {previewRows.filter(r => r.errors.length > 0).length > 0 && (
                  <div style={{ color: '#d32f2f', marginBottom: '10px' }}>
                    ⚠️ {previewRows.filter(r => r.errors.length > 0).length} fila(s) con errores de validación
                  </div>
                )}
                <div>Puedes hacer clic en cualquier celda para editar los datos antes de importar.</div>
              </div>
              <div className="preview-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="preview-table">
                  <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>DNI</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Grupo</th>
                      <th>Menú</th>
                      <th>Acomp.</th>
                      <th>Errores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr 
                        key={row.index} 
                        style={{ 
                          background: row.errors.length > 0 ? '#ffebee' : row.edited ? '#e3f2fd' : 'transparent'
                        }}
                      >
                        <td>{row.index + 1}</td>
                        <td>
                          {editingRow === row.index ? (
                            <input
                              type="text"
                              value={row.data.nombre || ''}
                              onChange={(e) => handleEditRow(row.index, 'nombre', e.target.value)}
                              onBlur={() => setEditingRow(null)}
                              style={{ width: '100%', padding: '4px' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingRow(row.index)}
                              style={{ cursor: 'pointer', display: 'block', padding: '4px' }}
                            >
                              {row.data.nombre || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingRow === row.index ? (
                            <input
                              type="text"
                              value={row.data.apellido || ''}
                              onChange={(e) => handleEditRow(row.index, 'apellido', e.target.value)}
                              onBlur={() => setEditingRow(null)}
                              style={{ width: '100%', padding: '4px' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingRow(row.index)}
                              style={{ cursor: 'pointer', display: 'block', padding: '4px' }}
                            >
                              {row.data.apellido || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingRow === row.index ? (
                            <input
                              type="text"
                              value={row.data.dni || ''}
                              onChange={(e) => handleEditRow(row.index, 'dni', e.target.value)}
                              onBlur={() => setEditingRow(null)}
                              style={{ width: '100%', padding: '4px' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingRow(row.index)}
                              style={{ cursor: 'pointer', display: 'block', padding: '4px' }}
                            >
                              {row.data.dni || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingRow === row.index ? (
                            <input
                              type="email"
                              value={row.data.email || ''}
                              onChange={(e) => handleEditRow(row.index, 'email', e.target.value)}
                              onBlur={() => setEditingRow(null)}
                              style={{ width: '100%', padding: '4px' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingRow(row.index)}
                              style={{ cursor: 'pointer', display: 'block', padding: '4px' }}
                            >
                              {row.data.email || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingRow === row.index ? (
                            <input
                              type="text"
                              value={row.data.telefono || ''}
                              onChange={(e) => handleEditRow(row.index, 'telefono', e.target.value)}
                              onBlur={() => setEditingRow(null)}
                              style={{ width: '100%', padding: '4px' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingRow(row.index)}
                              style={{ cursor: 'pointer', display: 'block', padding: '4px' }}
                            >
                              {row.data.telefono || '-'}
                            </span>
                          )}
                        </td>
                        <td>{row.data.grupo || '-'}</td>
                        <td>{row.data.menu || '-'}</td>
                        <td>{row.data.acompanantesEsperados || 0}</td>
                        <td style={{ color: '#d32f2f', fontSize: '12px' }}>
                          {row.errors.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {row.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          ) : (
                            '✓'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => {
                  setPreviewData(null);
                  setPreviewRows([]);
                }}>
                  Cancelar
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleImport} 
                  disabled={loading || previewRows.some(r => r.errors.length > 0)}
                  title={previewRows.some(r => r.errors.length > 0) ? 'Corrige los errores antes de importar' : ''}
                >
                  {loading ? 'Importando...' : 'Importar'}
                </button>
              </div>
            </div>
          )}

          {importResult && (
            <div>
              <h3>Resultado de la Importación</h3>
              <div className="import-results">
                <div className="result-success">
                  <strong>✅ Exitosos: {importResult.exitosos.length}</strong>
                </div>
                {importResult.errores.length > 0 && (
                  <div className="result-errors">
                    <strong>❌ Errores: {importResult.errores.length}</strong>
                    <ul>
                      {importResult.errores.slice(0, 5).map((err, idx) => (
                        <li key={idx}>
                          Fila {err.fila}: {err.error}
                        </li>
                      ))}
                    </ul>
                    {importResult.errores.length > 5 && (
                      <p>... y {importResult.errores.length - 5} errores más</p>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={onSuccess}>
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

