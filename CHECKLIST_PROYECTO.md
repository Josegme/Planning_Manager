# ✅ CHECKLIST - Planning Manager

## 📋 Estado del Proyecto

**Fecha de actualización:** 2026-02-17  
**Versión:** 0.11.0 (MVP funcional + Modo Recepción estable + mejoras UX y estilo premium)

---

## ✅ COMPLETADO

### 🔧 Configuración y Setup
- [x] Proyecto Electron + React + TypeScript configurado
- [x] Estructura Clean Architecture implementada
- [x] Base de datos SQLite configurada y funcionando
- [x] Migraciones de base de datos funcionando
- [x] Sistema de handlers IPC implementado
- [x] Preload.js configurado y funcionando
- [x] Vite configurado para desarrollo
- [x] TypeScript configurado para main y renderer
- [x] Detección automática de puerto de Vite

### 🐛 Correcciones de Errores Críticos
- [x] Error de compilación en QRCodeService.ts (propiedad quality eliminada)
- [x] Error de JSX en MesasPage.tsx (div extra eliminado)
- [x] Error "onSelectEvento is not defined" en DashboardOrganizador.tsx
- [x] Configuración de Vite para no abrir navegador automáticamente
- [x] Scripts de package.json corregidos (cross-platform)
- [x] Electron API disponible y funcionando
- [x] Aplicación renderiza correctamente
- [x] Interfaz duplicada EventoCardDashboardProps eliminada

### 📦 Infraestructura Backend
- [x] Base de datos SQLite con esquema completo
- [x] Repositorios SQLite implementados (eventos, invitados, mesas, timeline, servicios, proveedores)
- [x] Mappers Entity <-> DB implementados
- [x] Use Cases implementados para todos los módulos
- [x] Handlers IPC implementados para todos los módulos
- [x] Sistema de generación de QR codes
- [x] Parser de archivos Excel

### 🎨 Frontend - Páginas y Componentes
- [x] AppLayout con navegación lateral
- [x] DashboardOrganizador (multi-evento)
- [x] EventosListPage
- [x] EventoWizard (3 pasos: datos básicos, mesas, resumen)
- [x] EventoDashboardPage
- [x] InvitadosPage
- [x] MesasPage con drag & drop
- [x] TimelinePage
- [x] ServiciosPage
- [x] ProveedoresPage

### 🧩 Componentes Modales
- [x] EventoFormModal
- [x] InvitadoFormModal
- [x] ProveedorFormModal
- [x] ServicioFormModal
- [x] QRCodeModal
- [x] ImportExcelModal
- [x] TimelineEtapaFormModal

### 🧩 Componentes UI
- [x] TimelineBar
- [x] TimelineEtapaCard
- [x] EstadisticasFinancieras
- [x] DraggableInvitado
- [x] DroppableMesa

### 🔌 APIs y Servicios Frontend
- [x] eventos.api.ts (create, update, delete, getById, getAll, changeEstado)
- [x] invitados.api.ts (create, update, delete, getById, getAll, import, checkIn)
- [x] mesas.api.ts (create, update, delete, getAll, asignarInvitado, desasignarInvitado)
- [x] timeline.api.ts (create, update, delete, getAll, marcarCompletada, registrarTiempoReal, reordenar)
- [x] servicios.api.ts (create, update, delete, getAll, getEstadisticas)
- [x] proveedores.api.ts (create, update, delete, getAll)
- [x] excel.api.ts (parseExcel)

### 🪝 Hooks React
- [x] useEventos
- [x] useInvitados
- [x] useProveedores
- [x] useServicios
- [x] useTimeline

### ✅ Funcionalidades CRUD Implementadas
- [x] **Eventos:** Crear, Leer, Actualizar, Eliminar, Cambiar estado
- [x] **Invitados:** Crear, Leer, Actualizar, Eliminar, Importar Excel, Check-in
- [x] **Mesas:** Crear, Leer, Actualizar, Eliminar, Asignar/Desasignar invitados
- [x] **Timeline:** Crear, Leer, Actualizar, Eliminar, Marcar completada, Registrar tiempo real, Reordenar
- [x] **Servicios:** Crear, Leer, Actualizar, Eliminar, Estadísticas financieras
- [x] **Proveedores:** Crear, Leer, Actualizar, Eliminar

---

## ❌ PENDIENTE

### 🧪 Testing y Validación Funcional
- [ ] Probar creación de eventos (wizard completo)
- [ ] Probar edición de eventos
- [ ] Probar eliminación de eventos
- [ ] Probar cambio de estado de eventos
- [ ] Probar importación de invitados desde Excel
- [ ] Probar creación manual de invitados
- [ ] Probar asignación de mesas (drag & drop)
- [ ] Probar asignación automática de mesas
- [ ] Probar gestión completa de timeline
- [ ] Probar creación de servicios y proveedores
- [ ] Probar generación y visualización de QR codes
- [ ] Probar check-in de invitados
- [ ] Validar persistencia de datos en base de datos
- [ ] Validar cálculos financieros (costos, pagos, porcentajes)

### 🎨 UI/UX - Completado / Pendiente
- [x] **Estilo premium**: variables CSS globales (paleta dorado/violeta, fondos, sombras, radios), tipografía Plus Jakarta Sans, sidebar con gradiente e indicador lateral dorado para ítem activo
- [x] **Orden de eventos**: en Gestión de Eventos, lista ordenada por estado (Activos → Planificación → Finalizados) y por fecha más próxima
- [x] **Acompañantes en mesas**: en tarjetas de Asignación de Mesas se muestra "(+N)" junto al nombre del invitado cuando tiene acompañantes esperados
- [x] **Banner capacidad**: eliminado el banner grande "Capacidad Total de Eventos Activos" del Dashboard (info ya en cada tarjeta)
- [ ] Estilos CSS completos para todos los componentes (resto de páginas con variables)
- [ ] Mensajes de error más amigables y consistentes
- [ ] Loading states en todas las operaciones asíncronas
- [ ] Confirmaciones antes de eliminar datos (modales de confirmación)
- [ ] Validaciones de formularios en frontend (antes de enviar)
- [ ] Feedback visual para acciones del usuario (toasts, notificaciones)
- [ ] Manejo de estados vacíos (cuando no hay datos)
- [ ] Mejoras en responsive design (si es necesario)

### 📊 Funcionalidades Faltantes
- [ ] **Búsqueda y filtros avanzados:**
  - [ ] Búsqueda de invitados por DNI, nombre, apellido, mesa, grupo
  - [ ] Filtros por estado, menú, grupo, mesa
  - [ ] Ordenamiento por columnas en tablas
  - [ ] Paginación en listas grandes

- [x] **Exportación de datos:**
  - [x] Exportar invitados a Excel
  - [x] Exportar servicios a Excel (planilla de cálculos)
  - [x] Importar planilla de servicios desde Excel (con estructura validada y plantilla descargable)
  - [x] Imprimir / guardar como PDF la planilla de servicios
  - [ ] Exportar reportes a PDF (Asistencia, Mesas, Financiero, Completo, Timeline)

- [ ] **Funcionalidades avanzadas:**
  - [ ] Sistema de backup/restore (JSON o SQLite completo)
  - [ ] Estadísticas avanzadas en dashboard
  - [x] Regenerar QR codes individuales
  - [x] Descarga de QR: botón "Descargar QR" en modal de cada invitado; "Descargar todos los QR (ZIP)" en página de invitados
  - [ ] Envío masivo de QRs por email (requiere integración SMTP)

### 🔒 Validaciones Pendientes
- [ ] Validación de DNI (formato y duplicados)
- [ ] Validación de email (formato)
- [ ] Validación de teléfono (formato)
- [ ] Validación de fechas (fechas pasadas, rangos válidos)
- [ ] Prevención de duplicados (invitados, mesas)
- [ ] Validación de capacidad de mesas (no exceder límite)
- [ ] Validación de datos financieros (números positivos, formatos)
- [ ] Validación de campos requeridos en formularios

### 📱 Funcionalidades Avanzadas (v1.1 - Implementado)
- [x] Servidor HTTP local integrado
- [x] Sincronización multi-dispositivo (Modo Recepción: conexión por QR o URL, selección de evento, escaneo QR invitados, check-in)
- [x] **Modo Recepción estable**: uso de useSyncClient en un solo lugar (AppLayout); ConnectionPage y RecepcionPage reciben props; tras seleccionar evento se navega correctamente a RecepcionPage; filtro de eventos solo Activos en lista de recepción
- [x] **Check-in por QR sin bucles**: deduplicación en QRScanner y cooldown en RecepcionPage para evitar repetición de findByQR y titileo de pantalla
- [x] Caché offline en recepción y cola de check-ins pendientes al reconectar
- [x] Polling en dashboard del organizador para ver check-ins en tiempo real
- [x] Guía paso a paso del Modo Recepción (README_MODO_RECEPCION.md)
- [ ] Sistema de discovery (mDNS)
- [ ] Aplicación mobile/tablet dedicada para check-in (actualmente misma app en otra PC/tablet)
- [ ] Resolución de conflictos de sincronización
- [ ] Autenticación y seguridad
- [ ] Notificaciones locales del timeline
- [ ] Sistema de alertas visual en dashboard
- [ ] Checklist por etapa del timeline
- [ ] Temas personalizables

### 🐛 Problemas Conocidos (Menores)
- [ ] Warning de Content Security Policy (CSP) en desarrollo (no crítico, desaparece en producción)
- [ ] Verificar que el navegador no se abra automáticamente (puede requerir ajustes adicionales)

---

## 📝 NOTAS IMPORTANTES

1. **Estructura del proyecto:** Todo el código está en `desktop/`
   - `desktop/main/` = Proceso principal Electron (Backend)
   - `desktop/renderer/` = Frontend React

2. **Preload.js:** Debe estar en `desktop/main/dist/preload.js` después de compilar

3. **Base de datos:** Se crea automáticamente en `%APPDATA%\planning-manager\planning_manager.db`

4. **Comandos importantes:**
   ```bash
   npm run build:main    # Compilar proceso principal
   npm run dev           # Ejecutar en desarrollo
   ```

5. **Estado actual:** La aplicación está funcional con: modal al activar evento, contador de llegados en dashboard, info mesas en Invitados, mesas automáticas al aumentar cantidad, grupo en Gestión de Mesas, dashboard y timeline con info evento visible, planilla de servicios con export/import/imprimir, Modo Recepción estable (navegación correcta tras elegir evento, filtro solo eventos activos, check-in por QR sin bucles), descarga de QR individual y ZIP de todos los QRs, orden de eventos (Activos → Planificación → Finalizados por fecha), acompañantes (+N) en tarjetas de mesas, banner de capacidad eliminado, y estilo premium (variables CSS, tipografía Plus Jakarta Sans, sidebar con indicador activo). Ver README_MODO_RECEPCION.md para flujo de recepción.

6. **Modo Recepción:** Ver [README_MODO_RECEPCION.md](README_MODO_RECEPCION.md) para probar paso a paso (servidor, conexión, escaneo QR invitados, check-in).

---

## 🎯 PRÓXIMOS PASOS PRIORITARIOS

### Fase 1: Testing Completo (URGENTE)
1. Probar todas las funcionalidades CRUD básicas
2. Validar que los datos persisten correctamente
3. Identificar bugs y problemas de UX

### Fase 2: Validaciones y Mejoras UX
1. Implementar validaciones de formularios
2. Agregar confirmaciones antes de eliminar
3. Mejorar mensajes de error
4. Agregar loading states

### Fase 3: Funcionalidades Faltantes
1. Implementar búsqueda y filtros
2. Implementar exportación a Excel
3. Implementar generación de reportes PDF
4. Implementar sistema de backup/restore

### Fase 4: Pulido Final
1. Completar estilos CSS
2. Optimizar rendimiento
3. Preparar para producción
4. Documentación de usuario

---

**Última actualización:** 2026-02-17  
**Estado:** ✅ MVP Funcional + Modo Recepción estable + Mejoras UX y estilo premium - Listo para Testing y uso en evento
