# 📊 # Planning Manager

Aplicación para gestión de eventos.

## 🧭 Descripción General

**Planning Manager** es una aplicación de escritorio desarrollada para organizadores profesionales de eventos, diseñada para centralizar y optimizar toda la gestión operativa de un evento en una única plataforma.

El sistema permite gestionar de forma integral el ciclo completo de un evento:
- Planificación previa
- Ejecución en tiempo real
- Análisis posterior

Funciona bajo un enfoque **offline-first**, lo que garantiza su operatividad incluso en entornos sin conexión a internet, una característica crítica en eventos presenciales.

---

## 🎯 Propósito del Sistema

El objetivo principal de Planning Manager es eliminar la fragmentación en la organización de eventos, reemplazando herramientas dispersas como Excel, papel o múltiples aplicaciones.

La plataforma actúa como un **centro de mando digital**, permitiendo:
- Centralizar toda la información del evento
- Automatizar procesos operativos
- Reducir la carga administrativa del organizador
- Mejorar la toma de decisiones en tiempo real

---

## ⚙️ Modelo Actual

### 🖥️ Aplicación Desktop
- Ejecutable en Windows
- No requiere conexión a internet
- Base de datos local (SQLite)

### 🔌 Offline-First
- Funciona completamente sin conexión
- Ideal para eventos en locaciones con conectividad limitada

### 🔄 Sincronización (en evolución)
- Arquitectura preparada para conexión con dispositivos externos
- Posibilidad de check-in desde tablets en red local

---

## 🧱 Módulos Principales

### 1. Gestión de Eventos
- Creación y configuración de eventos
- Estados: planificación, activo, finalizado
- Dashboard por evento

### 2. Gestión de Invitados
- Importación masiva desde Excel
- Generación automática de códigos QR
- Filtros, búsqueda y segmentación
- Asignación a mesas

### 3. Gestión de Mesas
- Configuración de capacidad
- Visualización de ocupación
- Asignación manual y automática

### 4. Timeline del Evento
- Definición de etapas
- Control de tiempos planificados vs reales
- Seguimiento del progreso del evento

### 5. Servicios y Proveedores
- Gestión de proveedores
- Control de costos y pagos
- Estados financieros

### 6. Dashboard y Estadísticas
- Métricas en tiempo real
- Asistencia de invitados
- Estado de mesas y timeline
- Resumen financiero

### 7. Sistema de QR
- Generación automática por invitado
- Uso para check-in
- Exportación para distribución

### 8. Reportes y Exportación
- Exportación a Excel
- Generación de reportes en PDF
- Backup completo del sistema

---

## 🚀 Funcionalidades Clave

- ✅ Gestión integral del evento en una sola plataforma
- ✅ Funcionamiento sin internet
- ✅ Importación y exportación de datos
- ✅ Automatización de tareas repetitivas
- ✅ Visualización clara y operativa de información
- ✅ Preparado para operación en tiempo real

---

## 🧠 Arquitectura del Sistema

Planning Manager está desarrollado bajo principios de:

### Clean Architecture
- Separación clara de capas
- Independencia entre dominio, aplicación e infraestructura

### Principios SOLID
- Código mantenible y escalable
- Componentes desacoplados

### Patrones utilizados
- Repository Pattern
- Use Case Pattern
- Dependency Injection

Esto permite:
- Escalar funcionalidades fácilmente
- Reutilizar lógica de negocio
- Migrar a nuevas arquitecturas (como SaaS)

---

## 🛠️ Stack Tecnológico

### Frontend
- React
- TypeScript
- Vite
- Tailwind / UI frameworks

### Backend (local)
- Node.js
- Express.js

### Base de Datos
- SQLite (archivo local)

### Entorno
- Electron (aplicación desktop)

---

## 📈 Estado Actual del Proyecto

### Nivel de desarrollo
- Arquitectura: Completa
- Base de datos: Implementada
- Módulos principales: En desarrollo avanzado

### Capacidades actuales
- Gestión funcional de eventos
- Manejo de invitados y mesas
- Generación de QR
- Base para operación en tiempo real

---

## 🔍 Valor Diferencial

Planning Manager no es solo una herramienta de registro, sino un sistema orientado a:

👉 Optimizar la operación del evento en tiempo real

Se enfoca en:
- Velocidad de uso
- Claridad de información
- Reducción de errores humanos

---

## 🔮 Proyección del Sistema

El sistema actual sirve como base para evolucionar hacia:

### SaaS + PWA
- Acceso desde cualquier dispositivo
- Multiusuario
- Escalabilidad en la nube

### Sistema híbrido
- Offline-first + sincronización
- Operación distribuida en eventos

### Plataforma de gestión integral de eventos
- Mayor automatización
- Integraciones externas
- Experiencias personalizadas

---

## 🧾 Conclusión

Planning Manager representa una solución sólida y bien estructurada para la gestión de eventos, con una arquitectura robusta y preparada para evolucionar.

Actualmente cumple el rol de:

👉 Sistema central de organización y control operativo

Y se posiciona como la base ideal para el desarrollo de una plataforma SaaS moderna orientada a la operación de eventos en tiempo real.

