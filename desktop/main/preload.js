const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  eventos: {
    create: (dto) => ipcRenderer.invoke('eventos:create', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (dto) => ipcRenderer.invoke('eventos:update', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (id) => ipcRenderer.invoke('eventos:delete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getById: (id) => ipcRenderer.invoke('eventos:getById', id).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    getAll: () => ipcRenderer.invoke('eventos:getAll').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    changeEstado: (id, estado) => ipcRenderer.invoke('eventos:changeEstado', id, estado).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    getEstadisticas: (eventoId) => ipcRenderer.invoke('eventos:getEstadisticas', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    softDelete: (id) => ipcRenderer.invoke('eventos:softDelete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    recover: (id) => ipcRenderer.invoke('eventos:recover', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getHidden: () => ipcRenderer.invoke('eventos:getHidden').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
  },
  invitados: {
    create: (dto) => ipcRenderer.invoke('invitados:create', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (dto) => ipcRenderer.invoke('invitados:update', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (id) => ipcRenderer.invoke('invitados:delete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getById: (id) => ipcRenderer.invoke('invitados:getById', id).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    getAll: (eventoId) => ipcRenderer.invoke('invitados:getAll', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    import: (dto) => ipcRenderer.invoke('invitados:import', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    checkIn: (id, acompanantesReales) => ipcRenderer.invoke('invitados:checkIn', id, acompanantesReales).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    generarQRImagen: (codigoQR) => ipcRenderer.invoke('invitados:generarQRImagen', codigoQR).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    exportarQRPNG: (codigoQR, nombreInvitado) => ipcRenderer.invoke('invitados:exportarQRPNG', codigoQR, nombreInvitado).then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
    regenerarQR: (id) => ipcRenderer.invoke('invitados:regenerarQR', id).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
  },
  excel: {
    selectFile: () => ipcRenderer.invoke('excel:selectFile').then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
    parseFile: (filePath, eventoId) => ipcRenderer.invoke('excel:parseFile', filePath, eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    generateTemplate: () => ipcRenderer.invoke('excel:generateTemplate').then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
    exportInvitados: (eventoId, invitados, eventoNombre) => ipcRenderer.invoke('excel:exportInvitados', eventoId, invitados, eventoNombre).then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
    exportServicios: (eventoId, servicios, eventoNombre, proveedores) => ipcRenderer.invoke('excel:exportServicios', eventoId, servicios, eventoNombre, proveedores).then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
    parseFileServicios: (filePath, eventoId) => ipcRenderer.invoke('excel:parseFileServicios', filePath, eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    generateTemplateServicios: () => ipcRenderer.invoke('excel:generateTemplateServicios').then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
  },
  mesas: {
    getByEvento: (eventoId) => ipcRenderer.invoke('mesas:getByEvento', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    createFromEvento: (eventoId, cantidadMesas, capacidadMesa) => ipcRenderer.invoke('mesas:createFromEvento', eventoId, cantidadMesas, capacidadMesa).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (mesaId, capacidad, ubicacion) => ipcRenderer.invoke('mesas:update', mesaId, capacidad, ubicacion).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (mesaId) => ipcRenderer.invoke('mesas:delete', mesaId).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
  },
  timeline: {
    create: (dto) => ipcRenderer.invoke('timeline:create', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (dto) => ipcRenderer.invoke('timeline:update', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (id) => ipcRenderer.invoke('timeline:delete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getAll: (eventoId) => ipcRenderer.invoke('timeline:getAll', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    marcarCompletada: (id) => ipcRenderer.invoke('timeline:marcarCompletada', id).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    registrarTiempoReal: (id, horaInicio, horaFin) => ipcRenderer.invoke('timeline:registrarTiempoReal', id, horaInicio, horaFin).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    reordenar: (etapas) => ipcRenderer.invoke('timeline:reordenar', etapas).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
  },
  servicios: {
    create: (dto) => ipcRenderer.invoke('servicios:create', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (dto) => ipcRenderer.invoke('servicios:update', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (id) => ipcRenderer.invoke('servicios:delete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getAll: (eventoId) => ipcRenderer.invoke('servicios:getAll', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    getEstadisticas: (eventoId) => ipcRenderer.invoke('servicios:getEstadisticas', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
  },
  proveedores: {
    create: (dto) => ipcRenderer.invoke('proveedores:create', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    update: (dto) => ipcRenderer.invoke('proveedores:update', dto).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    delete: (id) => ipcRenderer.invoke('proveedores:delete', id).then(result => {
      if (result.success) return;
      throw new Error(result.error);
    }),
    getAll: () => ipcRenderer.invoke('proveedores:getAll').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error);
    }),
    exportExcel: (proveedores) => ipcRenderer.invoke('proveedores:exportExcel', proveedores).then(result => {
      if (result.success) return result.filePath;
      throw new Error(result.error);
    }),
  },
  sync: {
    startServer: () => ipcRenderer.invoke('sync:startServer').then(result => {
      if (result.success) return result;
      throw new Error(result.error || 'Error al iniciar servidor');
    }),
    stopServer: () => ipcRenderer.invoke('sync:stopServer').then(result => {
      if (result.success) return result;
      throw new Error(result.error || 'Error al detener servidor');
    }),
    getServerStatus: () => ipcRenderer.invoke('sync:getServerStatus').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error || 'Error al obtener estado del servidor');
    }),
    getServerIP: () => ipcRenderer.invoke('sync:getServerIP').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error || 'Error al obtener IP del servidor');
    }),
    generateConnectionQR: () => ipcRenderer.invoke('sync:generateConnectionQR').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error || 'Error al generar QR de conexión');
    }),
    saveEventoCache: (payload) => ipcRenderer.invoke('sync:saveEventoCache', payload).then(result => {
      if (result.success) return result;
      throw new Error(result.error || 'Error al guardar caché');
    }),
    getEventoCache: (eventoId) => ipcRenderer.invoke('sync:getEventoCache', eventoId).then(result => {
      if (result.success) return result.data;
      throw new Error(result.error || 'Error al leer caché');
    }),
    addPendingCheckIn: (item) => ipcRenderer.invoke('sync:addPendingCheckIn', item).then(result => {
      if (result.success) return result;
      throw new Error(result.error || 'Error al guardar check-in pendiente');
    }),
    getPendingCheckIns: () => ipcRenderer.invoke('sync:getPendingCheckIns').then(result => {
      if (result.success) return result.data;
      throw new Error(result.error || 'Error al leer pendientes');
    }),
    clearPendingCheckIns: () => ipcRenderer.invoke('sync:clearPendingCheckIns').then(result => {
      if (result.success) return result;
      throw new Error(result.error || 'Error al limpiar pendientes');
    }),
  },
});
