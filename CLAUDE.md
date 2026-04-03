# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ REGLAS DE TRABAJO — LEER ANTES DE CUALQUIER ACCIÓN

### SIEMPRE hacer esto antes de codear:
1. **Mostrar un plan** detallando qué archivos vas a tocar y por qué
2. **Esperar aprobación** antes de ejecutar cualquier cambio
3. **Un cambio a la vez** — no hacer refactoring masivo sin confirmación explícita
4. **Si algo no está claro**, preguntar antes de asumir

### NUNCA hacer esto:
- ❌ Modificar archivos en `renderer/src/core/` — están DEPRECADOS
- ❌ Cambiar el esquema de la DB directamente — siempre via migraciones numeradas
- ❌ Romper el contrato IPC existente en `electronAPI.d.ts` — es el contrato entre main y renderer
- ❌ Mezclar lógica de negocio en el renderer — toda lógica va en `main/core/`
- ❌ Crear endpoints Express sin documentarlos en este archivo
- ❌ Instalar dependencias npm sin avisar primero
- ❌ Modificar `preload.js` sin verificar que el script `copy:preload` siga funcionando

### Cuando toques la base de datos:
- ⚠️ ADVERTIR explícitamente antes de cualquier cambio de schema
- Crear SIEMPRE una nueva migración numerada en `main/database/migrations/`
- Seguir el patrón `00N_descripcion.ts` y registrar en `migrationRunner.ts`
- Nunca modificar migraciones existentes — solo agregar nuevas

---

## Project Overview

Planning Manager es una aplicación de escritorio Electron para organizadores de eventos. Soporta dos modos operacionales:
- **Organizador**: Gestión completa de eventos (eventos, invitados, mesas, timeline, servicios, proveedores)
- **Recepcion**: Se conecta via red local al equipo del organizador para check-in de invitados con códigos QR

---

## Commands

Todos los comandos se ejecutan desde `desktop/`:

```bash
# Desarrollo (inicia Vite dev server + compila main + lanza Electron)
npm run dev

# Compilar solo el proceso principal
npm run build:main

# Compilar solo el renderer
npm run build:renderer

# Compilar todo
npm run build

# Empaquetar para distribución (instalador Windows NSIS → release/)
npm run dist

# Reconstruir módulos nativos tras cambios de versión Node/Electron
npm run rebuild
```

El renderer tiene su propio package.json en `desktop/renderer/`:
```bash
cd desktop/renderer && npm install
cd desktop && npm install
```

No hay suite de tests configurada.

---

## Architecture

El proyecto usa Clean Architecture / DDD con dos targets de compilación TypeScript separados:

### Main Process (`desktop/main/`)
- Compilado via `tsc -p main/tsconfig.json` → output a `main/dist/` (CommonJS)
- Entry point: `main/main.ts` — inicializa DB, handlers IPC, y BrowserWindow
- **`main/database/`** — Conexión SQLite (`better-sqlite3`) y migraciones versionadas
- **`main/core/`** — ✅ FUENTE DE VERDAD: Entidades, interfaces de repositorio, casos de uso, DTOs, implementaciones SQLite
- **`main/handlers/`** — Registros de handlers IPC (un archivo por dominio)
- **`main/server/`** — Servidor HTTP Express (puerto 8080) para modo Recepcion
- **`main/preload.js`** — Expone `window.electronAPI` via `contextBridge`

### Renderer Process (`desktop/renderer/`)
- Construido con Vite + React 18 + TypeScript (ESNext modules, `noEmit: true`)
- Entry: `renderer/src/main.tsx` → `App.tsx` → `AppLayout.tsx`
- **`renderer/src/presentation/`** — Todo el UI: páginas, componentes, hooks, wrappers de servicios API
- **`renderer/src/shared/types/`** — Tipos TypeScript compartidos. `electronAPI.d.ts` es la fuente de verdad del contrato IPC
- Path aliases: `@/*` → `src/*`, `@core/*`, `@presentation/*`, `@shared/*`

> ⚠️ IMPORTANTE: `renderer/src/core/` contiene duplicados DESACTUALIZADOS. La implementación canónica vive en `main/core/`. El renderer SOLO accede a datos via `window.electronAPI`.

### IPC Contract

El renderer se comunica con el main process EXCLUSIVAMENTE via `window.electronAPI` (definido en `renderer/src/shared/types/electronAPI.d.ts`):

| Namespace | Handler | Descripción |
|-----------|---------|-------------|
| `eventos` | `eventosHandler.ts` | CRUD + soft delete/recover |
| `invitados` | `invitadosHandler.ts` | CRUD + check-in + generación QR |
| `mesas` | `mesasHandler.ts` | Gestión de mesas |
| `timeline` | `timelineHandler.ts` | Gestión de etapas, reordenamiento, tracking en tiempo real |
| `servicios` | `serviciosHandler.ts` | Servicios + estadísticas financieras |
| `proveedores` | `proveedoresHandler.ts` | CRUD de proveedores |
| `excel` | `excelHandler.ts` | Import/export Excel para invitados y servicios |
| `sync` | `syncHandler.ts` | Start/stop servidor HTTP local, conexión QR, caché offline |

### Database

Archivo SQLite almacenado en `userData` de Electron (`planning_manager.db`). Los cambios de schema se manejan via archivos de migración numerados en `main/database/migrations/`.

**Para agregar una migración:**
1. Crear nuevo archivo con patrón `00N_descripcion.ts`
2. Registrarlo en `migrationRunner.ts`
3. ⚠️ Nunca modificar migraciones existentes

### Sync / Recepcion Mode

Cuando el organizador inicia el servidor sync (`window.electronAPI.sync.startServer()`), Express escucha en `0.0.0.0:8080`. Un QR codifica la URL de conexión. El dispositivo en modo Recepcion escanea el QR, se conecta, y realiza check-ins via REST API (`/api/invitados`, `/api/mesas`, etc.). Los check-ins offline se encolan localmente y sincronizan al reconectarse.

---

## Key Conventions

- Todos los llamados IPC siguen el patrón: el handler main retorna `{ success: true, data }` o `{ success: false, error }`, y `preload.js` desenvuelve estos — lanzando error o retornando data.
- UUIDs (paquete `uuid`) se generan en los casos de uso para IDs de nuevas entidades.
- El renderer usa hooks custom (`useEventos`, `useInvitados`, etc.) en `presentation/hooks/` para encapsular todos los llamados a `window.electronAPI` y estado local.
- Los archivos CSS están colocados junto a su archivo de componente/página.

---

## Guía para agregar features nuevas

Seguir siempre este orden:

1. **Migración DB** (si aplica) → `main/database/migrations/`
2. **Entidad/DTO** → `main/core/domain/`
3. **Caso de uso** → `main/core/usecases/`
4. **Repositorio SQLite** → `main/core/repositories/`
5. **Handler IPC** → `main/handlers/`
6. **Actualizar contrato** → `renderer/src/shared/types/electronAPI.d.ts`
7. **Hook en renderer** → `renderer/src/presentation/hooks/`
8. **UI/Componente** → `renderer/src/presentation/`
