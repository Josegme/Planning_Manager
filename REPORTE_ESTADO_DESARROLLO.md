# Reporte de Estado del Desarrollo - Planning Manager

**Fecha:** 17 de febrero de 2026  
**Objetivo:** Estado actual del proyecto para empaquetado, instalación y uso por el cliente.

---

## 0. Mejoras y funcionalidades añadidas

### Sesión 30 ene 2026

- **Activar evento**: Modal de confirmación al pasar evento a Activo; avisos si no es la fecha/hora programada o si no hay invitados o mesas completas.
- **Dashboard organizador**: Contador de invitados llegados junto a cada evento activo ("X llegados de Y personas").
- **Gestión de Invitados**: Bloque visible con cantidad de mesas y capacidad del evento entre estadísticas y filtros.
- **Mesas adicionales**: Al aumentar "Cantidad de Mesas" en el evento, las mesas faltantes se crean al abrir Invitados o Mesas (backend + frontend).
- **Gestión de Mesas**: Se muestra el grupo de cada invitado (Familia, Amigos, etc.) en invitados sin mesa y en cada mesa.
- **Dashboard del evento**: Tarjetas más compactas; fecha, hora y lugar más visibles y sin errores ortográficos.
- **Timeline**: Información clave del evento (fecha, hora, lugar) visible en la parte superior del panel.
- **Planilla de servicios**: Exportar a Excel, importar desde Excel (estructura validada), plantilla descargable, Imprimir / PDF.
- **Modo Recepción**: Guía paso a paso para estudiar y probar el flujo completo en **[README_MODO_RECEPCION.md](README_MODO_RECEPCION.md)** (activar servidor, conectar recepción, escanear QR de invitados, check-in, verificación).

### Sesión feb 2026 (estabilidad Modo Recepción, UX y estilo)

- **Modo Recepción – flujo y estado compartido**: Se corrigió la navegación tras seleccionar evento: `useSyncClient` se instancia una sola vez en `AppLayout` y se pasan `connect`, `syncEvento`, `eventoData`, etc. como props a `ConnectionPage` y `RecepcionPage`. Así, al elegir un evento se navega correctamente a la pantalla de Recepción. Se añadió `isSyncing` en el hook para no pausar el intervalo de verificación durante la sincronización.
- **Modo Recepción – filtro de eventos**: En el servidor (GET `/api/eventos`) solo se devuelven eventos en estado **Activo** para la lista de recepción.
- **Modo Recepción – bucle al escanear QR**: Se evitó la repetición de llamadas `findByQR` y el titileo de pantalla: en `QRScanner` se deduplica por contenido del QR y se detiene el escáner antes de notificar; en `RecepcionPage` se añade cooldown y flag de procesamiento para no tratar el mismo QR varias veces.
- **Descarga de QR**: Botón "Descargar QR" en el modal de cada invitado (PNG); botón "Descargar todos los QR (ZIP)" en la página de Invitados (visible cuando hay QRs generados), usando la dependencia `jszip` en el renderer.
- **Orden de eventos**: En Gestión de Eventos la lista se ordena por estado (Activos → Planificación → Finalizados) y dentro de cada grupo por fecha más próxima primero.
- **Acompañantes en mesas**: En las tarjetas de Asignación de Mesas se muestra "(+N)" junto al nombre del invitado cuando tiene acompañantes esperados (ej.: "Nombre Apellido (+2)").
- **Dashboard**: Eliminado el banner grande "Capacidad Total de Eventos Activos" (la información ya está en cada tarjeta de evento).
- **Estilo premium**: Variables CSS globales en `index.css` (paleta dorado #C9A84C, violeta, fondos oscuros/limpios, sombras, radios, transiciones); tipografía **Plus Jakarta Sans** (Google Font); sidebar en `AppLayout.css` con gradiente de fondo, separadores sutiles e **indicador lateral** (borde izquierdo dorado) para el ítem activo en lugar de fondo plano. Sin cambios de layout ni lógica, solo estilos.

---

## 1. Resumen ejecutivo

| Aspecto | Estado | Nota |
|--------|--------|------|
| **Compilación (main)** | ✅ OK | TypeScript del proceso principal compila correctamente |
| **Compilación (renderer)** | ✅ Ajustes hechos | Errores TypeScript corregidos; build debe ejecutarse en tu entorno |
| **Carga en producción** | ✅ Implementado | La app ya carga el frontend desde archivo (no solo desde Vite) |
| **Configuración empaquetado** | ✅ Añadida | electron-builder configurado para Windows (NSIS) |
| **Listo para instalar** | 🟡 Casi | Falta ejecutar `npm run build` y `npm run dist` en tu máquina |

---

## 2. Cambios realizados en esta sesión

### 2.1 Tipo global `electronAPI` (TypeScript)

- **Problema:** Varios archivos declaraban `window.electronAPI` con tipos distintos y TypeScript reportaba conflictos (TS2717).
- **Solución:** Se creó un único tipo en `desktop/renderer/src/shared/types/electronAPI.d.ts` con toda la API (eventos, invitados, excel, mesas, timeline, servicios, proveedores, sync) y se eliminaron las declaraciones duplicadas en cada `*.api.ts`.
- **Archivos tocados:**  
  `eventos.api.ts`, `invitados.api.ts`, `excel.api.ts`, `mesas.api.ts`, `timeline.api.ts`, `servicios.api.ts`, `proveedores.api.ts`, `sync.api.ts`.

### 2.2 Errores TypeScript en el renderer

- Imports no usados de `React` eliminados o sustituidos por hooks donde correspondía.
- Parámetros no usados prefijados con `_` o eliminados (p. ej. `onMove`, `item`, `monitor` en `TimelineEtapaCard`; `estado` en `DashboardOrganizador`; etc.).
- Tipado en `ImportExcelModal`: `validateRow` con `Record<string, unknown>` y uso de `String(...).trim()` para evitar errores con `unknown`.
- Tipado en `EventoEstadisticas`: `proximaEtapa` y `resumenFinanciero` definidos como `ProximaEtapaInfo` y `ResumenFinancieroInfo` en `electronAPI.d.ts`.
- `timeline.api.ts`: `registrarTiempoReal` recibe `string | null` (se usa `?? null` para `toISOString()`).
- `invitados.api.ts`: retorno de `import` tipado como `ImportResult` con cast donde hace falta.

### 2.3 Carga en producción (main process)

- **Problema:** `main.ts` solo cargaba la app desde el servidor de desarrollo de Vite (puertos 5173–5180). En producción no hay Vite, por lo que la ventana quedaba en blanco.
- **Solución:** Se añadió detección de entorno:
  - Si `app.isPackaged` o `NODE_ENV === 'production'`, se usa `mainWindow.loadFile(rendererPath)` con `path.join(__dirname, '..', 'renderer', 'dist', 'index.html').
  - En desarrollo se mantiene la lógica anterior (buscar puerto de Vite y cargar desde `http://localhost:...`).

### 2.4 Configuración de Vite para producción

- En `desktop/renderer/vite.config.ts` se configuró `base: './'` para que los recursos (JS/CSS) se resuelvan con rutas relativas al `index.html` cuando Electron carga desde `file://`.
- Sin esto, la app empaquetada puede no cargar bien los assets.

### 2.5 Configuración de electron-builder

- En `desktop/package.json` se añadió la sección `"build"`:
  - `appId`: `com.planningmanager.app`
  - `productName`: `Planning Manager`
  - `directories.output`: `release`
  - `files`: `main/dist/**`, `renderer/dist/**`, `package.json`
  - `win.target`: `["nsis"]` (instalador Windows)
  - `nsis`: instalación no “one-click”, directorio seleccionable, idioma español.

Con esto, al ejecutar `npm run dist` desde `desktop/` se generará el instalador en `desktop/release/`.

---

## 3. Plan de Sincronización Multi-Computadora (concretado)

El plan definido en `sincronización_multi-computadora_8a46a750.plan.md` estaba **parcialmente implementado**. En esta sesión se completaron las partes críticas que faltaban.

### 3.1 Lo que ya existía (antes de esta sesión)

- **Fase 1 – Servidor HTTP local**: `desktop/main/server/server.ts` en `0.0.0.0:8080`, CORS, rutas `/api/eventos`, `/api/invitados`, `/api/mesas`, `/api/timeline`, `/api/servicios`, `/api/health`. Rutas de invitados: `GET /:eventoId`, `GET /findByQR/:codigoQR/:eventoId`, `POST /checkin`.
- **Handlers IPC**: `sync:startServer`, `sync:stopServer`, `sync:getServerStatus`, `sync:getServerIP`, `sync:generateConnectionQR`.
- **Cliente HTTP (SyncClient)**: `connect`, `disconnect`, `checkConnection`, `syncEvento`, `findInvitadoByQR`, `sendCheckIn`.
- **UI**: `ConnectionPage` (IP + QR), `RecepcionPage` (check-in por QR y búsqueda), `SyncServerPanel` en Dashboard Organizador, `ConnectionQRModal`.
- **AppLayout**: modo recepción cuando `isConnected` y `eventoData`; integración con `ConnectionPage` y `RecepcionPage`.
- **Utilidades de red**: `networkUtils.ts` con `getLocalIP`, `getAllLocalIPs`, `isValidLocalIP`.

### 3.2 Lo que se implementó en esta sesión (crítico)

1. **Pantalla inicial de selección de modo (Plan Fase 3.2)**  
   - Nueva página **ModeSelectPage**: al abrir la app se elige **“Soy Organizador”** o **“Soy Recepción”**.  
   - La elección se guarda en `localStorage` para la próxima vez.  
   - En el sidebar del modo Organizador se añadió **“Modo Recepción”** para cambiar a recepción sin cerrar la app.  
   - En ConnectionPage se añadió **“Usar como Organizador”** para volver al modo organizador.

2. **Caché offline en recepción (Plan Fase 4.1 / 6.1)**  
   - **Backend (main)**: Handlers IPC `sync:saveEventoCache`, `sync:getEventoCache`.  
   - Los datos del evento se guardan en `userData/PlanningManager/reception_cache.json` (por `eventoId`).  
   - **RecepcionPage**: al montar se carga caché con `getEventoCache(eventoId)`; si hay datos se muestran aunque no haya conexión.  
   - Tras una sincronización correcta se llama a `saveEventoCache`.  
   - Así, recepción puede seguir mostrando invitados y búsqueda con la última copia aunque se pierda la red.

3. **Cola de check-ins offline (Plan Fase 4.2 / 6.1)**  
   - **Backend (main)**: Handlers `sync:addPendingCheckIn`, `sync:getPendingCheckIns`, `sync:clearPendingCheckIns`.  
   - Cola persistida en `userData/PlanningManager/pending_checkins.json`.  
   - **RecepcionPage**: si se hace check-in sin conexión (o falla el envío), se guarda en cola y se muestra “Check-in guardado localmente. Se enviará al reconectar.”  
   - Al volver a tener conexión se envían todos los pendientes al servidor y se vacía la cola.  
   - Indicador “X pendiente(s)” en el header cuando hay check-ins en cola.

4. **Selección de evento al conectar (Plan Fase 4.1)**  
   - En **SyncClient** se añadió `getEventos()` (GET `/api/eventos`).  
   - En **ConnectionPage**, al conectar sin `eventoId` se muestra la lista de eventos del servidor; el usuario elige uno y se sincroniza ese evento antes de pasar a RecepcionPage.

5. **Polling en dashboard del organizador (Plan Fase 4.3)**  
   - En **EventoDashboardPage** se añadió un intervalo cada 10 segundos que llama a `EventosAPI.getEstadisticas(eventoId)` y actualiza las estadísticas.  
   - Los check-ins hechos desde recepción se reflejan en el organizador sin recargar la página.

6. **Ajustes de flujo y UI**  
   - “Desconectar” en RecepcionPage solo limpia el evento de recepción y vuelve a ConnectionPage (no cambia a modo organizador).  
   - Recepción muestra “Modo Offline” cuando no hay conexión y “X pendiente(s)” cuando hay check-ins en cola.  
   - Búsqueda manual en recepción funciona con caché (no se deshabilita por estar offline si ya hay invitados cargados).  
   - Escanear QR en recepción sigue requiriendo conexión al servidor.

### 3.3 Resumen del plan

| Fase / ítem del plan                         | Estado      |
|---------------------------------------------|------------|
| Fase 1: Servidor HTTP local                 | ✅ Completo |
| Fase 2: Discovery (IP, QR de conexión)      | ✅ Completo |
| Fase 3: Modo Recepción (ConnectionPage, RecepcionPage, selección de modo) | ✅ Completo |
| Fase 4: Sincronización (inicial, check-ins, polling organizador) | ✅ Completo |
| Fase 5: UI control servidor (SyncServerPanel, QR) | ✅ Completo |
| Fase 6: Offline (caché, cola check-ins, indicadores) | ✅ Completo |
| Fase 7: Testing en red local                | Pendiente (manual) |

El plan de sincronización multi-computadora queda **concretado** a nivel de desarrollo; falta solo la validación en red local con dos PCs (Fase 7).

---

## 4. Pasos para dejar listo el instalador

Ejecutar en tu máquina, desde la raíz del proyecto:

```bash
cd desktop
npm install
cd renderer
npm install
cd ..
npm run build
npm run dist
```

- **`npm run build`**  
  Compila el proceso principal (main) y el frontend (renderer).  
  Si algo falla, revisar que Node/npm y las dependencias estén bien instalados.

- **`npm run dist`**  
  Genera el instalador con electron-builder.  
  El resultado estará en `desktop/release/` (por ejemplo un `.exe` de instalación NSIS).

Opcional: para probar la app empaquetada sin instalar:

```bash
cd desktop
npm run build
npm run start
```

Con `NODE_ENV=production` o ejecutando el `.exe` generado, la ventana debería cargar el frontend desde `renderer/dist/index.html`.

---

## 5. Estado por módulo (según README del proyecto)

| Módulo | Completitud (referencia) | Notas |
|--------|--------------------------|--------|
| Arquitectura / BD | 100% | SQLite, migraciones, handlers IPC |
| Eventos | ~80% | CRUD, wizard, estadísticas |
| Invitados | ~80% | CRUD, Excel, QR |
| Mesas | ~80% | CRUD, asignación |
| Timeline | ~80% | Etapas, estados |
| Servicios/Proveedores | ~80% | CRUD, finanzas |
| Dashboard | ~70% | Estadísticas en tiempo real |
| QR | ~70% | Generación y visualización |
| Reportes PDF | 0% | Pendiente (Módulo 8) |
| Sincronización (servidor local) | Completo | Servidor HTTP, Modo Recepción estable (navegación, filtro eventos activos, sin bucle QR), check-in por QR, caché offline, cola pendientes; ver README_MODO_RECEPCION.md |
| Planilla servicios (Excel/PDF) | Completo | Export, import con validación, plantilla, imprimir/PDF |

Para un **primer uso por el cliente** (instalación y uso del servicio), la base actual es suficiente siempre que no se exija aún reportes PDF ni sincronización multi-dispositivo completa.

---

## 5. Recomendaciones antes de entregar al cliente

1. **Ejecutar build y dist**  
   Asegurarse de que `npm run build` y `npm run dist` terminen sin errores en un entorno Windows representativo (el mismo tipo de máquina que usará el cliente si es posible).

2. **Probar el instalador**  
   Instalar en una máquina limpia o en una VM y comprobar:
   - Que la aplicación abre y se ve el layout principal.
   - Que se puede crear/editar un evento, invitados, mesas, timeline, servicios.
   - Que la base de datos se crea y persiste (p. ej. en `%APPDATA%` o junto al ejecutable, según cómo esté configurado el path de la BD).

3. **Base de datos**  
   Confirmar dónde se guarda `planning_manager.db` (o el nombre que use `database/connection.ts`) en instalación típica (por ejemplo en `userData` de Electron) y documentarlo para el cliente (backups, restauración).

4. **Icono e identidad**  
   Si quieres un icono propio en el instalador y en la barra de tareas, añadir `build/icon.ico` y en `package.json` → `build.win` volver a poner algo como `"icon": "build/icon.ico"`.

5. **Reportes PDF (Módulo 8)**  
   Si el cliente los necesita desde el primer día, habría que priorizar ese módulo; si no, se puede dejar para una siguiente versión.

---

## 7. Conclusión

- **¿Está todo correcto para empaquetar?**  
  Sí, a nivel de código y configuración: tipos unificados, carga en producción y electron-builder están listos.

- **¿Faltan ajustes?**  
  Solo los operativos: ejecutar `npm run build` y `npm run dist` en tu entorno, probar el instalador y, si aplica, añadir icono y documentar ubicación de la base de datos.

- **¿Listo para que el cliente instale y use el servicio?**  
  Sí, una vez generado y probado el instalador en `desktop/release/`. Los módulos core (eventos, invitados, mesas, timeline, servicios, dashboard, QR) están implementados en un grado suficiente para un primer uso; reportes PDF y sincronización avanzada quedan como evolución futura.
