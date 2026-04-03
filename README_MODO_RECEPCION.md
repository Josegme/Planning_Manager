# Modo Recepción – Guía paso a paso

Esta guía describe cómo usar el **Modo Recepción** de Planning Manager para escanear los códigos QR de los invitados, registrar su ingreso (check-in) y verificar que las actualizaciones se reflejen correctamente en la aplicación del organizador.

---

## 1. Conceptos importantes

- **QR de conexión**: Es el código QR que muestra el **organizador** (botón "Mostrar QR de Conexión"). Sirve para que la computadora o tablet de **recepción** se conecte al servidor del organizador. **No** es el QR del invitado.
- **QR del invitado**: Es el código QR único de cada invitado (generado en Invitados, visible en el modal de cada invitado). Ese es el que se escanea en recepción para registrar el check-in.
- **Servidor**: La aplicación del organizador actúa como servidor en la red local (WiFi o cable). Otras dispositivos se conectan a él mediante la URL o el QR de conexión.

---

## 2. Requisitos previos

- Al menos **un evento** creado y en estado **Activo** (o al menos con invitados cargados).
- **Invitados** con **QR generado** (en Gestión de Invitados, la columna "QR Generados" debe mostrar cantidad > 0). Si un invitado no tiene QR, abrir su fila → ícono de tarjeta/QR → "Generar QR".
- **Misma red local**: La PC del organizador y la PC/tablet de recepción deben estar en la misma red (mismo WiFi o conectadas por cable al mismo router).

---

## 3. Paso a paso – Organizador (servidor)

### 3.1 Iniciar el servidor

1. Abre **Planning Manager** en la PC del organizador.
2. Si te pide elegir modo, elige **"Soy Organizador"** (o ya estarás en modo organizador).
3. En el menú lateral, entra en **"Modo Recepción"** (o localiza el panel de **Sincronización multi-computadora** en el Dashboard).
4. Pulsa **"Iniciar Servidor"** (o el botón equivalente para activar el servidor).
5. Verifica que aparezca **"Servidor Activo"** (indicador verde) y que se muestren:
   - **IP local** (ej.: 192.168.1.25)
   - **Puerto** (ej.: 8080)
   - **URL** (ej.: http://192.168.1.25:8080)

### 3.2 Mostrar el QR de conexión (para la recepción)

1. Pulsa **"Mostrar QR de Conexión"**.
2. Se abrirá un modal con un **código QR** y la URL.
3. **Mantén esta ventana visible** para que en la PC de recepción puedan escanear este QR (o anotar la URL).

### 3.3 Tener a mano el QR de un invitado (para la prueba)

1. Ve a **Eventos** → selecciona tu evento → **Invitados**.
2. En la lista de invitados, localiza uno que aún esté en estado "Pendiente".
3. Haz clic en el ícono de **tarjeta/QR** de ese invitado para abrir el modal con su **QR de invitado**.
4. Deja ese modal abierto en una pantalla (o imprime el QR) para poder escanearlo luego desde la recepción.

---

## 4. Paso a paso – Recepción (cliente)

### 4.1 Conectar al servidor del organizador

1. En la **otra PC o tablet** (recepción), abre **Planning Manager**.
2. Si es la primera vez, elige **"Soy Recepción"**. Si ya lo elegiste antes, irás directo a la pantalla de conexión.
3. Verás la pantalla **"Modo Recepción"** con dos métodos:

   **Método 1 – Escanear QR**
   - Pulsa **"Escanear QR"**.
   - Apunta la cámara al **QR de conexión** que está mostrando el organizador (el de "Mostrar QR de Conexión").
   - Cuando se reconozca el código, la app se conectará al servidor.

   **Método 2 – URL manual**
   - En el campo de texto, ingresa la **URL del servidor** (ej.: `http://192.168.1.25:8080`).
   - Pulsa **"Conectar"**.

4. Tras conectar, si el servidor tiene **varios eventos**, se mostrará una lista con **solo los eventos en estado Activo**. Elige el evento (ej.: "Boda Lucia y Martín").
5. Al hacer clic en el evento, se sincronizan los datos y la app **navega automáticamente** a la pantalla de **Recepción** (título "Recepción - [Nombre del evento]").

### 4.2 Registrar el check-in de un invitado

Tienes dos formas:

**A) Escaneando el QR del invitado**

1. En la pantalla de Recepción, pulsa **"Escanear QR"** (el botón grande "📱 Escanear QR").
2. Apunta la cámara al **QR del invitado** (el que viste en Invitados en la PC del organizador, o el que tiene impreso el invitado).
3. Si el código es válido y corresponde a ese evento:
   - Se abrirá un formulario con el nombre del invitado.
   - Debes indicar **cuántos acompañantes llegaron** (número entre 0 y el máximo configurado para ese invitado).
4. Pulsa **"Confirmar Check-in"**.
5. Deberías ver el mensaje de éxito (ej.: "Check-in confirmado para [Nombre Apellido]") y el contador **"Check-in Realizados"** aumentará.

**B) Búsqueda manual (sin cámara)**

1. En la misma pantalla de Recepción, en **"Buscar Manualmente"**, escribe el **nombre**, **apellido** o **DNI** del invitado.
2. Pulsa **"Buscar"**.
3. Si el invitado existe y está Pendiente, se abrirá el mismo formulario de check-in.
4. Indica acompañantes que llegaron y confirma. El efecto es el mismo que con el QR.

### 4.3 Verificar en recepción

- El indicador de conexión debe mostrar **"Conectado"** (punto verde).
- Los contadores **Total Invitados**, **Pendientes** y **Check-in Realizados** deben actualizarse.
- Si intentas escanear o buscar de nuevo al **mismo invitado** ya registrado, debe aparecer: **"Este invitado ya realizó check-in"**. El escáner está preparado para no repetir la misma lectura varias veces (evita titileos o bucles al mantener el QR frente a la cámara).

---

## 5. Paso a paso – Verificación en el organizador

1. En la **PC del organizador**, ve al **Dashboard** del evento (o al Dashboard del organizador).
2. **Check-in Realizados** y **Porcentaje de Asistencia** se actualizan solos cada unos segundos (polling). Deberías ver un check-in más.
3. En **Invitados**, el invitado que acabas de marcar debe aparecer en estado **"Confirmado"** (badge verde).
4. En el **Dashboard del organizador**, en la tarjeta del evento activo, la línea **"X llegados de Y personas"** debe reflejar el nuevo ingreso (y los acompañantes si los indicaste).

---

## 6. Resumen rápido

| Paso | Quién | Acción |
|------|--------|--------|
| 1 | Organizador | Iniciar servidor y (opcional) "Mostrar QR de Conexión". |
| 2 | Recepción | Conectar: escanear el **QR de conexión** o ingresar la URL del servidor. |
| 3 | Recepción | Seleccionar el evento si hay más de uno. |
| 4 | Recepción | Escanear el **QR del invitado** (o buscar por nombre/DNI). |
| 5 | Recepción | Confirmar check-in indicando acompañantes que llegaron. |
| 6 | Organizador | Comprobar en Dashboard e Invitados que el check-in se ve actualizado. |

---

## 7. Modo offline (recepción)

Si la recepción **pierde la conexión** con el organizador:

- La app puede seguir mostrando la **última lista de invitados** (caché).
- Los check-ins que hagas se **guardan en cola local** y verás un mensaje tipo "Check-in guardado localmente. Se enviará al reconectar."
- Cuando la conexión vuelva, los check-ins pendientes se **envían solos** al servidor y la cola se vacía.
- En el encabezado de recepción se muestra **"X pendiente(s)"** cuando hay check-ins en cola.

---

## 8. Desconectar

- En la pantalla de Recepción, el botón **"Desconectar"** solo sale de la vista del evento y vuelve a la pantalla de conexión (elegir evento o conectar de nuevo). No cierra la aplicación.
- Para volver a usar la app como organizador, en la pantalla de conexión usa **"Usar como Organizador"** (o en el menú del organizador no entres en Modo Recepción).

---

**Última actualización:** 17 de febrero de 2026
