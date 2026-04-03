# Planning Manager - Aplicación Desktop para Organizadores de Eventos

## 📋 Descripción del Proyecto

**Planning Manager** es una aplicación de escritorio (Windows) diseñada específicamente para organizadores profesionales de eventos. Permite gestionar todo el ciclo de vida de un evento: desde la planificación inicial hasta la generación de reportes post-evento, funcionando completamente **offline** sin necesidad de conexión a internet.

---

## 🎯 Visión del Proyecto

### Problema que Resuelve

Los organizadores de eventos enfrentan múltiples desafíos:
- Gestión manual de listas de invitados (Excel, papel)
- Organización compleja de mesas y asignaciones
- Seguimiento del timeline del evento
- Control financiero de proveedores y servicios
- Generación manual de reportes y estadísticas

### Solución

Una aplicación desktop unificada que:
- ✅ Funciona **offline** (sin internet)
- ✅ Gestiona todo el ciclo del evento en un solo lugar
- ✅ Interfaz optimizada para escritorio (notebook)
- ✅ Genera reportes automáticos en PDF
- ✅ Importa/exporta datos desde/hacia Excel
- ✅ Base de datos local SQLite (portable y robusta)

---

## 📖 Documentación adicional

- **[Modo Recepción – Guía paso a paso](README_MODO_RECEPCION.md)**: Cómo activar el servidor, conectar la recepción, escanear QR de invitados, registrar check-in y verificar actualizaciones. Incluye prueba completa del flujo.

---

## 🔄 Mejoras recientes (enero–febrero 2026)

- **Activar evento**: Modal de confirmación al pasar un evento a Activo; avisos si la fecha/hora no es la programada o si faltan invitados/mesas.
- **Dashboard del organizador**: Contador de invitados llegados junto a cada evento activo ("X llegados de Y personas"); **banner "Capacidad Total de Eventos Activos" eliminado** (la información ya está en cada tarjeta).
- **Gestión de Invitados**: Bloque visible con cantidad de mesas y capacidad del evento; **descarga de QR**: botón "Descargar QR" en el modal de cada invitado y botón **"Descargar todos los QR (ZIP)"** cuando hay QRs generados.
- **Mesas adicionales**: Si se aumenta "Cantidad de Mesas" en el evento, las mesas faltantes se crean automáticamente al abrir Gestión de Invitados o Gestión de Mesas.
- **Gestión de Mesas**: Se muestra el **grupo** de cada invitado y, junto al nombre, **cantidad de acompañantes** cuando aplica (ej.: "Nombre Apellido (+2)").
- **Gestión de Eventos**: Lista ordenada por **estado** (Activos → En Planificación → Finalizados) y por **fecha más próxima** primero.
- **Dashboard del evento**: Tarjetas más compactas; información de fecha, hora y lugar más visible y sin errores ortográficos.
- **Timeline del evento**: Se muestra la misma información clave del evento (fecha, hora, lugar) en la parte superior del panel.
- **Planilla de servicios**: Exportar a Excel, importar desde Excel (con estructura validada), descargar plantilla, e Imprimir / guardar como PDF desde el diálogo de impresión.
- **Modo Recepción**: Flujo corregido: una sola instancia de estado de sincronización (useSyncClient en AppLayout); tras conectar y seleccionar evento se navega correctamente a la pantalla de Recepción; en la lista solo se muestran eventos **Activos**; corrección del bucle al escanear QR (deduplicación y cooldown para evitar titileo y repetición de solicitudes).
- **Estilo premium**: Variables CSS globales (paleta dorado #C9A84C y violeta, fondos oscuros/limpios), tipografía **Plus Jakarta Sans**, sidebar con gradiente e **indicador lateral** para el ítem activo (sin fondos planos agresivos).

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### MÓDULO 1: Gestión de Eventos

- [ ] **Crear evento** (Wizard 3 pasos):
  - [ ] Paso 1: Datos básicos (nombre, tipo, fecha, hora, lugar, descripción)
  - [ ] Paso 2: Configuración de mesas (con/sin mesas, cantidad, capacidad por mesa)
  - [ ] Paso 3: Resumen y confirmación
- [ ] **Listar eventos** (vista de tabla/cards con filtros)
- [ ] **Editar evento** (modificar datos, excepto si está finalizado)
- [ ] **Eliminar evento** (con confirmación, solo si no tiene datos asociados)
- [ ] **Cambiar estado del evento**: Planificación → Activo → Finalizado
- [ ] **Dashboard del evento** con estadísticas en tiempo real
- [ ] **Vista multi-evento** (dashboard organizador con todos los eventos)

### MÓDULO 2: Gestión de Invitados

- [ ] **Importar desde Excel**:
  - [ ] Parser de archivos .xlsx/.xls
  - [ ] Validación automática (DNI, email, teléfono)
  - [ ] Vista previa antes de importar
  - [ ] Template descargable con estructura fija
  - [ ] Detección y manejo de duplicados
  - [ ] Generación automática de códigos QR únicos
- [ ] **CRUD de invitados**:
  - [ ] Crear invitado manualmente
  - [ ] Editar invitado
  - [ ] Eliminar invitado (con confirmación)
  - [ ] Ver detalles del invitado
- [ ] **Búsqueda y filtros**:
  - [ ] Búsqueda por DNI, nombre, apellido, mesa, grupo
  - [ ] Filtros por estado, menú, grupo, mesa
  - [ ] Ordenamiento por columnas
- [ ] **Asignación de mesas**:
  - [ ] Asignar invitado a mesa manualmente
  - [ ] Asignación automática (algoritmo de distribución)
  - [ ] Cambiar mesa de invitado
- [ ] **Visualización de QR codes** (mostrar QR generado)
- [ ] **Estadísticas de invitados**: Total, con email, con teléfono, QR generados

### MÓDULO 3: Gestión de Mesas

- [ ] **CRUD de mesas**:
  - [ ] Crear mesa (número, capacidad, ubicación)
  - [ ] Editar mesa
  - [ ] Eliminar mesa (solo si está vacía)
- [ ] **Visualización de ocupación**:
  - [ ] Vista de mesas con indicadores visuales (completa/parcial/vacía)
  - [ ] Mostrar ocupación en tiempo real (X/Y personas)
  - [ ] Colores: Verde (completa), Amarillo (parcial), Gris (vacía)
- [ ] **Asignación visual**:
  - [ ] Arrastrar y soltar invitados a mesas
  - [ ] Ver detalle de mesa con lista de invitados
- [ ] **Modo sin mesas** (para eventos informales)

### MÓDULO 4: Timeline del Evento

- [ ] **CRUD de etapas**:
  - [ ] Crear etapa (nombre, hora planificada, duración estimada)
  - [ ] Editar etapa
  - [ ] Eliminar etapa
  - [ ] Reordenar etapas (drag & drop)
- [ ] **Control de timeline**:
  - [ ] Marcar etapa como completada
  - [ ] Registrar hora de inicio real
  - [ ] Registrar hora de fin real
  - [ ] Agregar retraso manual
- [ ] **Visualización**:
  - [ ] Barra de progreso del evento
  - [ ] Colores de estado:
  - 🟢 Verde: Completado/a tiempo
  - 🟡 Amarillo: Retraso leve o manual
  - 🔴 Rojo: Retraso significativo
- [ ] **Estados automáticos**: Pendiente, En curso, Completado

### MÓDULO 5: Gestión de Servicios y Proveedores

- [ ] **CRUD de servicios**:
  - [ ] Crear servicio (nombre, descripción, proveedor)
  - [ ] Editar servicio
  - [ ] Eliminar servicio
- [ ] **Información de proveedores**:
  - [ ] Nombre del proveedor
  - [ ] Contacto (teléfono, email)
  - [ ] Dirección
  - [ ] Base de datos de proveedores reutilizables
- [ ] **Control financiero**:
  - [ ] Costo unitario
  - [ ] Cantidad
  - [ ] Costo total (cálculo automático)
  - [ ] Moneda (ARS, USD, EUR)
  - [ ] Pagos parciales
  - [ ] Porcentaje pagado (cálculo automático)
- [ ] **Estados de servicio**: Cotizado, Contratado, Pagado, Cancelado
- [ ] **Estadísticas financieras**:
  - [ ] Total de costos del evento
  - [ ] Total pagado
  - [ ] Total pendiente
  - [ ] Resumen por proveedor

### MÓDULO 6: Dashboard y Estadísticas

- [ ] **Dashboard principal del evento**:
  - [ ] Total de invitados
  - [ ] Invitados llegados (check-in)
  - [ ] Porcentaje de asistencia
  - [ ] Mesas completas/parciales/vacías
  - [ ] Estado del timeline (próxima etapa)
  - [ ] Resumen financiero (total, pagado, pendiente)
- [ ] **Dashboard del organizador** (multi-evento):
  - [ ] Lista de eventos por estado (Activos, Planificación, Finalizados)
  - [ ] Estadísticas consolidadas
  - [ ] Navegación rápida a cada evento
- [ ] **Actualización en tiempo real** (refresh automático y manual)

### MÓDULO 7: Generación y Envío de QR

- [ ] **Generación de QR codes**:
  - [ ] Formato único: `EVT{evento_id}-INV{invitado_id}-{hash}`
  - [ ] Generación automática al importar/crear invitado
  - [ ] Regenerar QR si es necesario
- [ ] **Visualización de QR**:
  - [ ] Mostrar QR en pantalla
  - [ ] Exportar QR como imagen (PNG)
- [ ] **Envío de QR**:
  - [ ] Compartir QR individual (copiar imagen)
  - [ ] Envío masivo por email (UI lista, requiere integración SMTP)
  - [ ] Exportar lista de QRs para impresión

### MÓDULO 8: Reportes y Exportación

- [ ] **Reportes en PDF**:
  - [ ] Reporte de Asistencia (lista completa con estado de check-in)
  - [ ] Reporte de Mesas (ocupación y distribución)
  - [ ] Reporte Financiero (costos, pagos, pendientes)
  - [ ] Reporte Completo (resumen general del evento)
  - [ ] Reporte de Timeline (etapas y tiempos reales)
- [ ] **Exportación de datos**:
  - [ ] Exportar invitados a Excel
  - [ ] Exportar servicios a Excel
  - [ ] Backup completo (JSON/SQLite)
  - [ ] Restaurar desde backup

### MÓDULO 9: Sincronización (Opcional - v1.1)

- [ ] **Servidor HTTP local**:
  - [ ] Iniciar/detener servidor desde la app
  - [ ] Servidor Express.js en puerto configurable (default: 8080)
  - [ ] Generar QR de conexión con IP del servidor
- [ ] **Endpoints de sincronización**:
  - [ ] GET /api/eventos (lista de eventos)
  - [ ] GET /api/eventos/:id (evento completo)
  - [ ] GET /api/invitados/:eventoId
  - [ ] GET /api/mesas/:eventoId
  - [ ] GET /api/timeline/:eventoId
  - [ ] POST /api/checkin (recibir check-ins de tablets)
  - [ ] GET /api/checkins/:eventoId
  - [ ] GET /api/servicios/:eventoId
- [ ] **Discovery en red local** (mDNS/Bonjour)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Electron**: Framework para aplicaciones desktop multiplataforma
- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Vite**: Build tool rápido para desarrollo
- **Ant Design / Material-UI / Tailwind CSS**: Framework de UI
- **Zustand / Redux Toolkit**: Gestión de estado

### Backend (Proceso Principal Electron)
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web para servidor HTTP local
- **better-sqlite3**: Driver SQLite nativo y rápido

### Base de Datos
- **SQLite**: Base de datos relacional embebida
- **Archivo único**: `planning_manager.db` (portable y fácil de respaldar)

### Herramientas de Desarrollo
- **electron-builder**: Empaquetado y distribución (.exe)
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **ESLint + Prettier**: Linting y formateo de código

### Librerías Específicas
- **xlsx / exceljs**: Importación/exportación de archivos Excel
- **qrcode**: Generación de códigos QR
- **pdfkit / jspdf**: Generación de reportes PDF
- **date-fns**: Manipulación de fechas

---

## 🏗️ Arquitectura de Software - Clean Architecture + SOLID

### Principios de Diseño

La aplicación sigue los principios **SOLID** y la **Clean Architecture** para garantizar:
- ✅ **Mantenibilidad**: Código fácil de entender y modificar
- ✅ **Testabilidad**: Componentes aislados y fáciles de testear
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Reutilización**: Componentes y servicios reutilizables
- ✅ **Independencia**: Capas desacopladas entre sí

### Estructura de Carpetas (Clean Architecture)

```
PlanningManager/
├── desktop/
│   ├── main/                          # Proceso principal Electron
│   │   ├── main.ts                    # Entry point Electron
│   │   ├── server/
│   │   │   ├── server.ts              # Servidor Express.js
│   │   │   ├── routes/                # Rutas API
│   │   │   │   ├── eventos.routes.ts
│   │   │   │   ├── invitados.routes.ts
│   │   │   │   ├── mesas.routes.ts
│   │   │   │   ├── timeline.routes.ts
│   │   │   │   ├── servicios.routes.ts
│   │   │   │   └── sync.routes.ts
│   │   │   └── middleware/            # Middleware Express
│   │   │       ├── errorHandler.ts
│   │   │       └── validation.ts
│   │   └── database/
│   │       ├── connection.ts          # Conexión SQLite
│   │       ├── migrations/            # Migraciones de BD
│   │       └── seeds/                 # Datos iniciales
│   │
│   └── renderer/                      # Frontend React
│       ├── src/
│       │   ├── core/                  # Capa de Dominio (Domain Layer)
│       │   │   ├── domain/
│       │   │   │   ├── entities/      # Entidades de negocio
│       │   │   │   │   ├── Evento.ts
│       │   │   │   │   ├── Invitado.ts
│       │   │   │   │   ├── Mesa.ts
│       │   │   │   │   ├── TimelineEtapa.ts
│       │   │   │   │   ├── Servicio.ts
│       │   │   │   │   └── Proveedor.ts
│       │   │   │   ├── value-objects/ # Value Objects
│       │   │   │   │   ├── DNI.ts
│       │   │   │   │   ├── Email.ts
│       │   │   │   │   ├── Telefono.ts
│       │   │   │   │   └── QRCode.ts
│       │   │   │   ├── repositories/  # Interfaces de repositorios (SOLID: DIP)
│       │   │   │   │   ├── IEventoRepository.ts
│       │   │   │   │   ├── IInvitadoRepository.ts
│       │   │   │   │   ├── IMesaRepository.ts
│       │   │   │   │   ├── ITimelineRepository.ts
│       │   │   │   │   └── IServicioRepository.ts
│       │   │   │   └── services/      # Servicios de dominio
│       │   │   │       ├── QRGeneratorService.ts
│       │   │   │       ├── MesaAssignmentService.ts
│       │   │   │       └── TimelineService.ts
│       │   │   │
│       │   │   ├── application/       # Capa de Aplicación (Use Cases)
│       │   │   │   ├── use-cases/     # Casos de uso (SOLID: SRP)
│       │   │   │   │   ├── eventos/
│       │   │   │   │   │   ├── CreateEventoUseCase.ts
│       │   │   │   │   │   ├── UpdateEventoUseCase.ts
│       │   │   │   │   │   ├── DeleteEventoUseCase.ts
│       │   │   │   │   │   └── GetEventoUseCase.ts
│       │   │   │   │   ├── invitados/
│       │   │   │   │   │   ├── ImportInvitadosFromExcelUseCase.ts
│       │   │   │   │   │   ├── CreateInvitadoUseCase.ts
│       │   │   │   │   │   └── AssignMesaToInvitadoUseCase.ts
│       │   │   │   │   ├── mesas/
│       │   │   │   │   │   ├── CreateMesaUseCase.ts
│       │   │   │   │   │   └── AutoAssignInvitadosUseCase.ts
│       │   │   │   │   ├── timeline/
│       │   │   │   │   │   ├── CreateEtapaUseCase.ts
│       │   │   │   │   │   └── MarkEtapaCompletedUseCase.ts
│       │   │   │   │   └── servicios/
│       │   │   │   │       ├── CreateServicioUseCase.ts
│       │   │   │   │       └── RegisterPaymentUseCase.ts
│       │   │   │   │
│       │   │   │   ├── dto/           # Data Transfer Objects
│       │   │   │   │   ├── CreateEventoDTO.ts
│       │   │   │   │   ├── ImportInvitadosDTO.ts
│       │   │   │   │   └── ...
│       │   │   │   │
│       │   │   │   └── interfaces/   # Interfaces de aplicación
│       │   │   │       ├── IExcelParser.ts
│       │   │   │       ├── IPDFGenerator.ts
│       │   │   │       └── IQRGenerator.ts
│       │   │   │
│       │   │   └── infrastructure/    # Capa de Infraestructura
│       │   │       ├── database/      # Implementación de repositorios
│       │   │       │   ├── repositories/
│       │   │       │   │   ├── SQLiteEventoRepository.ts
│       │   │       │   │   ├── SQLiteInvitadoRepository.ts
│       │   │       │   │   ├── SQLiteMesaRepository.ts
│       │   │       │   │   └── ...
│       │   │       │   └── mappers/   # Mappers Entity <-> DB
│       │   │       │       ├── EventoMapper.ts
│       │   │       │       └── ...
│       │   │       │
│       │   │       ├── external/      # Servicios externos
│       │   │       │   ├── excel/
│       │   │       │   │   └── ExcelParser.ts
│       │   │       │   ├── pdf/
│       │   │       │   │   └── PDFGenerator.ts
│       │   │       │   ├── qr/
│       │   │       │   │   └── QRGenerator.ts
│       │   │       │   └── email/
│       │   │       │       └── EmailService.ts
│       │   │       │
│       │   │       └── validation/    # Validadores
│       │   │           ├── DNIValidator.ts
│       │   │           ├── EmailValidator.ts
│       │   │           └── ...
│       │   │
│       │   ├── presentation/          # Capa de Presentación
│       │   │   ├── pages/             # Páginas/Vistas
│       │   │   │   ├── Dashboard/
│       │   │   │   │   ├── DashboardPage.tsx
│       │   │   │   │   └── components/
│       │   │   │   ├── Eventos/
│       │   │   │   │   ├── EventosListPage.tsx
│       │   │   │   │   ├── EventoCreatePage.tsx
│       │   │   │   │   ├── EventoEditPage.tsx
│       │   │   │   │   └── components/
│       │   │   │   │       ├── EventoWizard.tsx
│       │   │   │   │       └── EventoCard.tsx
│       │   │   │   ├── Invitados/
│       │   │   │   │   ├── InvitadosListPage.tsx
│       │   │   │   │   ├── InvitadoImportPage.tsx
│       │   │   │   │   └── components/
│       │   │   │   ├── Mesas/
│       │   │   │   ├── Timeline/
│       │   │   │   ├── Servicios/
│       │   │   │   └── Reportes/
│       │   │   │
│       │   │   ├── components/        # Componentes reutilizables
│       │   │   │   ├── common/       # Componentes comunes
│       │   │   │   │   ├── Button/
│       │   │   │   │   ├── Input/
│       │   │   │   │   ├── Table/
│       │   │   │   │   ├── Modal/
│       │   │   │   │   └── Card/
│       │   │   │   ├── forms/        # Componentes de formularios
│       │   │   │   └── charts/       # Gráficos y visualizaciones
│       │   │   │
│       │   │   ├── hooks/             # Custom React Hooks
│       │   │   │   ├── useEventos.ts
│       │   │   │   ├── useInvitados.ts
│       │   │   │   └── ...
│       │   │   │
│       │   │   ├── store/             # State Management (Zustand/Redux)
│       │   │   │   ├── slices/
│       │   │   │   │   ├── eventosSlice.ts
│       │   │   │   │   ├── invitadosSlice.ts
│       │   │   │   │   └── ...
│       │   │   │   └── store.ts
│       │   │   │
│       │   │   └── services/          # Servicios de API (cliente HTTP)
│       │   │       ├── api/
│       │   │       │   ├── eventos.api.ts
│       │   │       │   ├── invitados.api.ts
│       │   │       │   └── ...
│       │   │       └── httpClient.ts  # Cliente HTTP configurado
│       │   │
│       │   ├── shared/                # Código compartido
│       │   │   ├── utils/             # Utilidades
│       │   │   │   ├── dateUtils.ts
│       │   │   │   ├── formatUtils.ts
│       │   │   │   └── ...
│       │   │   ├── constants/         # Constantes
│       │   │   │   ├── routes.ts
│       │   │   │   └── config.ts
│       │   │   └── types/             # Tipos TypeScript compartidos
│       │   │       └── common.ts
│       │   │
│       │   └── App.tsx                # Componente raíz
│       │
│       ├── package.json
│       └── tsconfig.json
│
└── package.json                       # Root package.json
```

### Principios SOLID Aplicados

#### 1. Single Responsibility Principle (SRP)
Cada clase tiene una única responsabilidad:
- `CreateEventoUseCase`: Solo crear eventos
- `SQLiteEventoRepository`: Solo acceso a datos de eventos
- `ExcelParser`: Solo parsear Excel
- `PDFGenerator`: Solo generar PDFs

#### 2. Open/Closed Principle (OCP)
Abierto para extensión, cerrado para modificación:
- Interfaces de repositorios (`IEventoRepository`) permiten cambiar implementación sin modificar casos de uso
- Servicios externos (`IExcelParser`, `IPDFGenerator`) pueden intercambiarse

#### 3. Liskov Substitution Principle (LSP)
Las implementaciones pueden sustituirse:
- `SQLiteEventoRepository` implementa `IEventoRepository`
- Cualquier implementación de `IEventoRepository` funciona con los casos de uso

#### 4. Interface Segregation Principle (ISP)
Interfaces específicas y pequeñas:
- `IEventoRepository` solo métodos de eventos
- `IInvitadoRepository` solo métodos de invitados
- No hay interfaces "fat"

#### 5. Dependency Inversion Principle (DIP)
Dependencias hacia abstracciones:
- Casos de uso dependen de `IEventoRepository` (interfaz), no de `SQLiteEventoRepository` (implementación)
- Inyección de dependencias en constructores

### Flujo de Datos (Clean Architecture)

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (React Components)                  │
│  - Componentes UI                                       │
│  - Hooks personalizados                                 │
│  - State Management                                     │
└───────────────────┬─────────────────────────────────────┘
                    │ Calls
                    ▼
┌─────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases)                          │
│  - CreateEventoUseCase                                  │
│  - ImportInvitadosUseCase                               │
│  - Depende de: IEventoRepository (interface)           │
└───────────────────┬─────────────────────────────────────┘
                    │ Implements
                    ▼
┌─────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Entities + Interfaces)                   │
│  - Evento (Entity)                                      │
│  - IEventoRepository (Interface)                        │
│  - Business Rules                                       │
└───────────────────┬─────────────────────────────────────┘
                    │ Implements
                    ▼
┌─────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Implementations)                 │
│  - SQLiteEventoRepository                               │
│  - ExcelParser                                          │
│  - PDFGenerator                                         │
└─────────────────────────────────────────────────────────┘
```

### Patrones de Diseño Aplicados

1. **Repository Pattern**: Abstracción de acceso a datos
2. **Use Case Pattern**: Casos de uso encapsulan lógica de negocio
3. **Dependency Injection**: Inyección de dependencias
4. **Factory Pattern**: Creación de entidades complejas
5. **Strategy Pattern**: Diferentes algoritmos (asignación de mesas, generación de QR)

### Ejemplo de Código (TypeScript)

```typescript
// DOMAIN: Interface (DIP)
interface IEventoRepository {
  create(evento: Evento): Promise<Evento>;
  findById(id: string): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  update(evento: Evento): Promise<Evento>;
  delete(id: string): Promise<void>;
}

// DOMAIN: Entity
class Evento {
  constructor(
    public id: string,
    public nombre: string,
    public fecha: Date,
    public lugar: string,
    // ... otros campos
  ) {}
}

// APPLICATION: Use Case (SRP)
class CreateEventoUseCase {
  constructor(
    private eventoRepository: IEventoRepository, // DIP: depende de interfaz
    private validator: IEventoValidator
  ) {}

  async execute(dto: CreateEventoDTO): Promise<Evento> {
    // Validar
    this.validator.validate(dto);
    
    // Crear entidad
    const evento = new Evento(
      generateId(),
      dto.nombre,
      dto.fecha,
      dto.lugar
    );
    
    // Persistir
    return await this.eventoRepository.create(evento);
  }
}

// INFRASTRUCTURE: Implementation
class SQLiteEventoRepository implements IEventoRepository {
  constructor(private db: Database) {}
  
  async create(evento: Evento): Promise<Evento> {
    // Implementación SQLite
    const result = this.db.prepare(`
      INSERT INTO eventos (id, nombre, fecha, lugar)
      VALUES (?, ?, ?, ?)
    `).run(evento.id, evento.nombre, evento.fecha, evento.lugar);
    
    return evento;
  }
  
  // ... otros métodos
}
```

### Configuración de Dependencias

```typescript
// Dependency Injection Container (simplificado)
class Container {
  private db = new Database('planning_manager.db');
  
  // Repositories
  getEventoRepository(): IEventoRepository {
    return new SQLiteEventoRepository(this.db);
  }
  
  // Use Cases
  getCreateEventoUseCase(): CreateEventoUseCase {
    return new CreateEventoUseCase(
      this.getEventoRepository(),
      new EventoValidator()
    );
  }
}
```

---

## 💾 Base de Datos SQLite

### Esquema Principal

- `eventos` - Información de eventos
- `invitados` - Lista de invitados
- `mesas` - Configuración de mesas
- `checkins` - Registros de check-in (para sincronización futura)
- `timeline_etapas` - Etapas del timeline
- `servicios` - Servicios y proveedores
- `proveedores` - Base de proveedores

### Ventajas

- ✅ Archivo único `.db` portable
- ✅ Fácil backup (copiar archivo)
- ✅ Robusto y confiable
- ✅ No requiere servidor
- ✅ Funciona completamente offline

---

## 🎯 Casos de Uso Principales

### Caso 1: Organizador - Planificación del Evento

1. **Crear evento** con wizard (3 pasos)
2. **Importar lista de invitados** desde Excel
3. **Configurar mesas** (cantidad, capacidad)
4. **Asignar invitados** a mesas (automático o manual)
5. **Configurar timeline** del evento
6. **Agregar servicios/proveedores** con costos
7. **Generar QR codes** automáticamente
8. **Exportar QRs** para envío a invitados

### Caso 2: Organizador - Durante el Evento

1. **Ver dashboard** con estadísticas en tiempo real
2. **Controlar timeline** (marcar etapas completadas)
3. **Ver estado de mesas** (ocupación)
4. **Registrar check-ins** manualmente (si es necesario)
5. **Actualizar servicios** (pagos realizados)

### Caso 3: Organizador - Post-Evento

1. **Ver dashboard** con estadísticas finales
2. **Generar reportes** en PDF:
   - Reporte de asistencia
   - Reporte de mesas
   - Reporte financiero
   - Reporte completo
3. **Exportar datos** a Excel
4. **Crear backup** completo del evento

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos

- Node.js (>=18.0.0) - Recomendado: Node.js 20.x
- npm (incluido con Node.js)
- Windows 10/11 (para desarrollo y ejecución)
- Git (opcional, solo si clonas desde repositorio)

### Pasos de Instalación

1. **Navegar a la carpeta del proyecto**:
   ```bash
   cd Planning_Manager
   ```

2. **Instalar dependencias del proceso principal**:
   ```bash
   cd desktop
   npm install
   ```

3. **Instalar dependencias del renderer (frontend)**:
   ```bash
   cd renderer
   npm install
   cd ..
   ```

4. **Compilar el proceso principal (primera vez)**:
   ```bash
   npm run build:main
   ```
   Esto compila TypeScript y copia el archivo `preload.js` necesario.

5. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```
   
   Esto iniciará:
   - ✅ Compilación del proceso principal de Electron
   - ✅ Servidor de desarrollo Vite (puerto 5173)
   - ✅ Ventana de Electron con la aplicación
   - ✅ DevTools abiertos automáticamente

6. **Compilar para producción**:
   ```bash
   npm run build
   ```
   Esto compila tanto el proceso principal como el renderer.

7. **Generar instalador Windows (.exe)**:
   ```bash
   npm run dist
   ```

### ⚠️ Solución de Problemas Comunes

#### Error: "Electron API no disponible"
**Solución:**
```bash
cd desktop
npm run build:main
```
Esto asegura que `preload.js` esté copiado en `main/dist/`.

#### Error: "Cannot find module" o errores de compilación
**Solución:**
1. Verificar que todas las dependencias estén instaladas:
   ```bash
   cd desktop
   npm install
   cd renderer
   npm install
   ```

2. Limpiar y reinstalar:
   ```bash
   cd desktop
   rm -rf node_modules package-lock.json
   npm install
   cd renderer
   rm -rf node_modules package-lock.json
   npm install
   ```

#### El navegador se abre automáticamente
**Solución:** Ya está configurado para no abrir el navegador. Si aún se abre, verifica que `vite.config.ts` tenga `open: false` en la configuración del servidor.

#### Pantalla en blanco en Electron
**Solución:**
1. Abre DevTools (F12) y revisa la consola
2. Verifica que `window.electronAPI` esté disponible:
   ```javascript
   console.log(window.electronAPI)
   ```
3. Si es `undefined`, ejecuta `npm run build:main` nuevamente

#### Puerto de Vite diferente
Si Vite usa un puerto diferente a 5173, actualiza `desktop/main/main.ts` línea 30:
```typescript
mainWindow.loadURL('http://localhost:5175'); // Cambiar al puerto correcto
```

### 📁 Estructura del Proyecto

```
Planning_Manager/
├── desktop/                    # Aplicación Electron
│   ├── main/                   # Proceso principal (Backend)
│   │   ├── dist/               # Archivos compilados
│   │   │   ├── main.js
│   │   │   └── preload.js     # ⚠️ Importante: debe existir
│   │   ├── handlers/           # Handlers IPC
│   │   ├── database/           # Base de datos SQLite
│   │   └── core/               # Lógica de negocio
│   └── renderer/               # Frontend React
│       └── src/
│           ├── presentation/    # Componentes y páginas
│           │   ├── components/ # Componentes reutilizables
│           │   ├── pages/      # Páginas de la aplicación
│           │   └── services/   # APIs y servicios
│           └── shared/         # Código compartido
└── README_PROYECTO_PlanningManager.md
```

### 🔍 Verificación Rápida

Antes de ejecutar, verifica:
- ✅ `desktop/main/dist/preload.js` existe
- ✅ `desktop/main/dist/main.js` existe
- ✅ Dependencias instaladas en `desktop/` y `desktop/renderer/`
- ✅ Node.js >= 18.0.0 instalado

---

## 📊 Estado del Proyecto

### Progreso General

| Categoría | Completitud | Estado |
|----------|-------------|--------|
| **Arquitectura** | **100%** | ✅ Completada |
| **Configuración Base** | **100%** | ✅ Completada |
| **Base de Datos** | **100%** | ✅ Completada |
| **Módulo 1: Eventos** | **80%** | 🟡 En desarrollo |
| **Módulo 2: Invitados** | **80%** | 🟡 En desarrollo |
| **Módulo 3: Mesas** | **80%** | 🟡 En desarrollo |
| **Módulo 4: Timeline** | **80%** | 🟡 En desarrollo |
| **Módulo 5: Servicios** | **80%** | 🟡 En desarrollo |
| **Módulo 6: Dashboard** | **70%** | 🟡 En desarrollo |
| **Módulo 7: QR** | **70%** | 🟡 En desarrollo |
| **Módulo 8: Reportes** | **0%** | ❌ Pendiente |
| **Módulo 9: Sincronización** | **0%** | ⏸️ Opcional v1.1 |

### ✅ Completado

- ✅ Arquitectura Clean Architecture implementada
- ✅ Base de datos SQLite configurada con migraciones
- ✅ Sistema de handlers IPC funcionando
- ✅ Estructura de componentes React
- ✅ Integración Electron + React + TypeScript
- ✅ Sistema de generación de QR codes
- ✅ Parser de archivos Excel
- ✅ UI básica con navegación

### 🟡 En Desarrollo

- 🟡 Funcionalidades CRUD completas
- 🟡 Validaciones y manejo de errores
- 🟡 Testing y optimizaciones

---

## 🔄 Funcionalidades Futuras (v1.1+)

### Sincronización Multi-dispositivo
- Servidor HTTP local integrado
- Conexión de tablets para check-in
- Sincronización en tiempo real
- Discovery automático en red local

### Mejoras de UX
- Notificaciones locales del timeline
- Sistema de alertas visual en dashboard
- Checklist por etapa del timeline
- Temas personalizables

### Exportación Avanzada
- Exportar a Excel con formato personalizado
- Compartir eventos entre organizadores
- Integración con calendarios

---

## 🚀 Escalabilidad Multi-Dispositivo (v1.1+)

### 📋 Visión General

**Planning Manager** está diseñado para escalar a múltiples dispositivos conectados al software central, funcionando en modo **híbrido**: offline cuando no hay internet, y con sincronización automática cuando hay conexión (WiFi local o internet).

### 🎯 Arquitectura Híbrida Propuesta

```
┌─────────────────────────────────────────────────────────┐
│  🖥️ DESKTOP CENTRAL (Notebook del Organizador)          │
│  ─────────────────────────────────────────────────────  │
│  - SQLite (Base de datos maestra)                       │
│  - Servidor HTTP local (Express.js) - Puerto 8080      │
│  - Funciona OFFLINE siempre                            │
│  - Si hay internet: Sincroniza con otros dispositivos │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        │  Red Local (WiFi)     │  Internet (si disponible)
        │                       │
        ▼                       ▼
┌───────────────┐      ┌───────────────┐
│ 📱 TABLET 1   │      │ 📱 TABLET 2   │
│ (Check-in)    │      │ (Check-in)    │
│               │      │               │
│ - SQLite local│      │ - SQLite local│
│   (caché)     │      │   (caché)     │
│ - Cliente HTTP│      │ - Cliente HTTP│
│ - Offline-first│     │ - Offline-first│
└───────────────┘      └───────────────┘
```

### ✅ Características del Sistema Híbrido

| Característica | Modo Offline | Modo con Internet |
|----------------|--------------|-------------------|
| **Funcionamiento** | ✅ Totalmente funcional | ✅ Totalmente funcional |
| **Sincronización** | Solo red local (WiFi) | Red local + Internet |
| **Velocidad** | Muy rápida (LAN) | Rápida (LAN) o Media (Internet) |
| **Alcance** | Misma red WiFi | Cualquier lugar |
| **Datos** | SQLite local | SQLite local + sincronizado |

### 🔄 Flujo de Trabajo

#### Escenario 1: Sin Internet (Modo Offline)
1. Desktop central funciona normalmente (SQLite local)
2. Tablets se conectan por WiFi local al desktop
3. Sincronización vía red local (192.168.x.x:8080)
4. Cada tablet tiene caché local (SQLite) para trabajar offline
5. Cuando vuelve la conexión, sincroniza automáticamente

#### Escenario 2: Con Internet (Modo Híbrido)
1. Desktop central funciona normalmente
2. Tablets pueden conectarse:
   - Por WiFi local (más rápido, preferido)
   - Por internet si están en diferentes redes
3. Sincronización automática en ambos casos
4. El sistema detecta automáticamente qué conexión usar

---

## 📅 Plan de Desarrollo - Escalabilidad Multi-Dispositivo

### FASE 1: Servidor HTTP Local (2 semanas)

**Objetivo:** Implementar servidor HTTP en el proceso principal de Electron

**Tareas:**
- [ ] Configurar Express.js en proceso principal Electron
- [ ] Crear endpoints REST básicos:
  - [ ] `GET /api/eventos` - Lista de eventos
  - [ ] `GET /api/eventos/:id` - Evento completo
  - [ ] `GET /api/invitados/:eventoId` - Invitados del evento
  - [ ] `GET /api/mesas/:eventoId` - Mesas del evento
  - [ ] `GET /api/timeline/:eventoId` - Timeline del evento
- [ ] Implementar middleware CORS para permitir conexiones desde otros dispositivos
- [ ] Configurar servidor para escuchar en `0.0.0.0:8080` (accesible desde red local)
- [ ] Agregar UI para iniciar/detener servidor desde la aplicación
- [ ] Mostrar IP del servidor en la interfaz
- [ ] Generar QR code con URL de conexión (`http://[IP]:8080`)

**Entregables:**
- Servidor HTTP funcional
- Endpoints básicos operativos
- UI para control del servidor

---

### FASE 2: Sistema de Discovery (1 semana)

**Objetivo:** Permitir que los dispositivos encuentren automáticamente el servidor

**Tareas:**
- [ ] Implementar mDNS/Bonjour para anunciar servicio en red local
- [ ] Nombre del servicio: "PlanningManager Server"
- [ ] Generar QR code con IP del servidor como método alternativo
- [ ] Implementar fallback: entrada manual de IP si discovery falla
- [ ] UI para mostrar estado de discovery (activo/inactivo)

**Entregables:**
- Discovery automático funcional
- QR code de conexión generado
- Fallback manual implementado

---

### FASE 3: Cliente HTTP y Sincronización Base (2 semanas)

**Objetivo:** Implementar cliente HTTP en tablets y sincronización básica

**Tareas:**
- [ ] Crear servicio de sincronización (cliente HTTP)
- [ ] Implementar detección automática de conexión:
  - [ ] Detectar si hay WiFi local disponible
  - [ ] Detectar si hay internet disponible
  - [ ] Priorizar WiFi local sobre internet
- [ ] Implementar sincronización inicial:
  - [ ] Descargar evento completo al conectar
  - [ ] Guardar en SQLite local (caché)
- [ ] Implementar sincronización incremental:
  - [ ] Sincronizar solo cambios desde última conexión
  - [ ] Usar timestamps para determinar qué sincronizar
- [ ] Implementar cola de sincronización para datos offline
- [ ] Sincronización automática cada X segundos cuando hay conexión

**Entregables:**
- Cliente HTTP funcional
- Sincronización inicial e incremental
- Sistema de cola para datos offline

---

### FASE 4: Aplicación Mobile/Tablet (3 semanas)

**Objetivo:** Crear aplicación mobile/tablet para check-in

**Tareas:**
- [ ] Decidir tecnología: Flutter, React Native, o PWA
- [ ] Configurar proyecto mobile
- [ ] Implementar SQLite local (sqflite para Flutter)
- [ ] Implementar pantalla de conexión:
  - [ ] Escanear QR code del servidor
  - [ ] O ingresar IP manualmente
  - [ ] Guardar conexión para futuras sesiones
- [ ] Implementar pantalla de check-in:
  - [ ] Escanear QR code del invitado
  - [ ] Búsqueda manual por DNI/nombre
  - [ ] Confirmar check-in
  - [ ] Registrar acompañantes reales
- [ ] Implementar sincronización con servidor
- [ ] Implementar modo offline (guardar localmente si no hay conexión)

**Entregables:**
- Aplicación mobile/tablet funcional
- Check-in con escáner QR
- Sincronización con desktop central

---

### FASE 5: Resolución de Conflictos (1-2 semanas)

**Objetivo:** Manejar conflictos cuando múltiples dispositivos modifican los mismos datos

**Tareas:**
- [ ] Implementar sistema de versionado de datos
- [ ] Agregar timestamps a todas las modificaciones
- [ ] Implementar estrategia de resolución:
  - [ ] Last-write-wins para datos simples
  - [ ] Merge manual para datos complejos
  - [ ] Logs de cambios para auditoría
- [ ] UI para mostrar conflictos y resolverlos manualmente
- [ ] Testing de escenarios de conflicto

**Entregables:**
- Sistema de resolución de conflictos
- UI para manejo de conflictos
- Logs de auditoría

---

### FASE 6: Seguridad y Autenticación (1 semana)

**Objetivo:** Proteger la comunicación entre dispositivos

**Tareas:**
- [ ] Implementar autenticación simple (token o clave compartida)
- [ ] Cifrado en tránsito (HTTPS local con certificado autofirmado)
- [ ] Validación de dispositivos autorizados
- [ ] UI para configurar seguridad
- [ ] Generar y compartir clave de acceso

**Entregables:**
- Sistema de autenticación
- Comunicación cifrada
- Control de acceso

---

### FASE 7: Testing y Optimización (2 semanas)

**Objetivo:** Asegurar que el sistema funcione correctamente con múltiples dispositivos

**Tareas:**
- [ ] Testing con 5+ dispositivos conectados simultáneamente
- [ ] Testing con eventos grandes (500+ invitados)
- [ ] Testing de sincronización bajo diferentes condiciones:
  - [ ] Sin internet (solo WiFi local)
  - [ ] Con internet
  - [ ] Pérdida y recuperación de conexión
  - [ ] Múltiples dispositivos modificando simultáneamente
- [ ] Optimización de rendimiento:
  - [ ] Sincronización incremental eficiente
  - [ ] Compresión de datos si es necesario
  - [ ] Manejo de memoria en dispositivos móviles
- [ ] Corrección de bugs encontrados

**Entregables:**
- Sistema probado y estable
- Documentación de testing
- Optimizaciones implementadas

---

### FASE 8: Documentación y Distribución (1 semana)

**Objetivo:** Documentar y distribuir la funcionalidad multi-dispositivo

**Tareas:**
- [ ] Documentar configuración de red
- [ ] Crear guía de conexión de dispositivos
- [ ] Video tutorial de sincronización
- [ ] Actualizar manual de usuario
- [ ] Crear APK Android (si aplica)
- [ ] Crear instalador para tablets Windows (si aplica)

**Entregables:**
- Documentación completa
- Aplicación mobile distribuible
- Tutoriales y guías

---

## 📊 Resumen del Plan de Desarrollo

| Fase | Duración | Total Acumulado | Prioridad |
|------|----------|-----------------|-----------|
| Fase 1: Servidor HTTP | 2 semanas | 2 semanas | 🔴 Alta |
| Fase 2: Discovery | 1 semana | 3 semanas | 🟡 Media |
| Fase 3: Cliente y Sincronización | 2 semanas | 5 semanas | 🔴 Alta |
| Fase 4: App Mobile/Tablet | 3 semanas | 8 semanas | 🔴 Alta |
| Fase 5: Resolución Conflictos | 1-2 semanas | 9-10 semanas | 🟡 Media |
| Fase 6: Seguridad | 1 semana | 10-11 semanas | 🟡 Media |
| Fase 7: Testing | 2 semanas | 12-13 semanas | 🔴 Alta |
| Fase 8: Documentación | 1 semana | 13-14 semanas | 🟢 Baja |

**Total Estimado: 13-14 semanas (3-3.5 meses)**

---

## 🎯 Consideraciones Técnicas

### Ventajas de la Arquitectura Actual

1. **Offline-First**: Cada dispositivo funciona independientemente
2. **SQLite**: Base de datos fácil de replicar y sincronizar
3. **Servidor HTTP Local**: Ya contemplado en arquitectura base
4. **Clean Architecture**: Fácil agregar capa de sincronización sin modificar core

### Desafíos a Considerar

1. **Resolución de Conflictos**: Múltiples dispositivos modificando simultáneamente
2. **Rendimiento**: Sincronización eficiente con muchos dispositivos
3. **Seguridad**: Proteger comunicación en red local
4. **Compatibilidad**: Diferentes sistemas operativos en tablets

### Tecnologías Recomendadas

- **Servidor**: Express.js (ya en stack)
- **Discovery**: bonjour/mdns (Node.js)
- **Mobile**: Flutter (recomendado) o React Native
- **Cifrado**: HTTPS con certificado autofirmado
- **Sincronización**: REST API con timestamps

---

## ✅ Checklist de Implementación

### Preparación (Antes de comenzar)
- [ ] Validar necesidad del cliente
- [ ] Definir cantidad máxima de dispositivos
- [ ] Decidir tecnología mobile (Flutter/React Native/PWA)
- [ ] Planificar testing con dispositivos reales

### Desarrollo
- [ ] Fase 1: Servidor HTTP ✅
- [ ] Fase 2: Discovery ✅
- [ ] Fase 3: Cliente y Sincronización ✅
- [ ] Fase 4: App Mobile ✅
- [ ] Fase 5: Resolución Conflictos ✅
- [ ] Fase 6: Seguridad ✅
- [ ] Fase 7: Testing ✅
- [ ] Fase 8: Documentación ✅

### Post-Implementación
- [ ] Testing con cliente real
- [ ] Recopilar feedback
- [ ] Optimizaciones basadas en uso real
- [ ] Planificar mejoras futuras

---

**Nota:** Este plan está diseñado para implementarse después del MVP (v1.0) y puede ajustarse según las necesidades específicas del cliente.

---

## 📚 Documentación Adicional

- **[PROPUESTA_DE_VALOR_PLANNING_MANAGER.md](./PROPUESTA_DE_VALOR_PLANNING_MANAGER.md)**: Propuesta de valor y servicios del software para stakeholders
- **[VERIFICACION_PLAN_DESARROLLO.md](./VERIFICACION_PLAN_DESARROLLO.md)**: Verificación del plan de desarrollo y fases del proyecto

---

## 👥 Equipo y Contribución

### Estado Actual
- **Desarrollo**: En planificación
- **Arquitectura**: Definida
- **Stack**: Electron + React + TypeScript + SQLite

### Próximos Pasos
1. Configurar proyecto Electron + React + TypeScript
2. Implementar arquitectura base (Clean Architecture)
3. Configurar SQLite y migraciones
4. Implementar módulos según checklist

---

## 📝 Licencia

[Definir licencia]

---

## 📞 Contacto

[Definir información de contacto]

---

**Versión**: 1.0.0  
**Última actualización**: 2025-01-XX  
**Estado**: En Planificación 📋

