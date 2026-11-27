# F8 — Flujo Detallado de Pantallas (Refactor)

Documento que define la lógica interna, transiciones de estado y llamadas a endpoints de cada pantalla y diálogo modal de la interfaz.

---

## Convención y Leyenda

* **`P#` (Pantalla / Ruta):** Componente de página completa con ruta propia en `app.routes.ts`.
* **`D#` (Diálogo / Modal):** Componente modal contextual (`MatDialog`) sobre la vista actual.
* **`P#X` / `D#X` (Identificador de Función):** Código de pertenencia de cada método (ej. `P1A` es el método A de la pantalla `P1`; `D1A` es el método A del modal `D1`).
  * Cuando una función se **define por primera vez**, se redacta su bloque completo con su lógica y llamadas HTTP.
  * Cuando una función ya definida se **reutiliza o invoca en otro caso de uso**, solo se enuncia su firma (`P2A.cargarInquilino(id)`) sin duplicar su cuerpo.
* **`EP#` (Endpoint Backend):** Contrato y método HTTP formalizado en **B 7 -- Contratos.md**.
* **Estados de Vista:**
  * `cargando`: Petición asíncrona en curso.
  * `con-datos`: Datos recuperados y listos para renderizar.
  * `vacio`: Petición exitosa pero sin registros (`total == 0`).
  * `error`: Petición fallida con mensaje de feedback.

---

## Catálogo Maestro de Vistas

### Pantallas Principales (`P#`)
* **`P0`** — Iniciar Sesión (`/login`)
* **`P1`** — Lista de Inquilinos (`/inquilinos`)
* **`P2`** — Detalle de Inquilino (`/inquilinos/:id`)
* **`P3`** — Lista de Locales (`/locales`)
* **`P4`** — Detalle de Local (`/locales/:id`)
* **`P5`** — Lista de Contratos (`/contratos`)
* **`P6`** — Crear Contrato (`/contratos/crear`)
* **`P7`** — Detalle de Contrato (`/contratos/:id`)
* **`P8`** — Dashboard (`/dashboard`)

### Diálogos Modales (`D#`)
* **`D1`** — Modal Formulario Inquilino (Crear y Editar)
* **`D2`** — Modal Formulario Local (Crear y Editar)
* **`D3`** — Modal Editar Contrato (Local y observaciones)
* **`D4`** — Modal Renovar Contrato
* **`D5`** — Diálogo Confirmar Cierre de Contrato
* **`D6`** — Modal Registrar Movimiento de Garantía
* **`D7`** — Modal Detalle de Pago de Cuota
* **`D8`** — Modal Registrar Pago de Cuota
* **`D9`** — Modal Registrar Consumo de Luz
* **`D10`** — Modal Detalle de Consumo de Luz
* **`D11`** — Modal Registrar Pago de Consumo de Luz

---
---

## Inquilino

### Caso de uso 1: Registrar inquilino

```ts
P1 — Lista de inquilinos
  P1A.abrirModalRegistro() {
    abre D1
      ok (id) → navegar a /inquilinos/:id  // P2
  }

D1 — Modal Formulario inquilino
  D1A.registrarInquilino() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /inquilinos/register          // EP#1
          ok  → cierra modal y emite id
          err → muestra mensaje de error
      }
  }

  D1B.cancelar() {
    cierra modal
  }

P2 — Detalle de inquilino
  P2A.cargarInquilino(id) {
    estado = cargando
    datos = GET /inquilinos/:id            // EP#3
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 2: Listar inquilinos

```ts
P1 — Lista de inquilinos
  P1B.cargarInquilinos(page = 1, limit = 10) {
    estado = cargando
    datos = GET /inquilinos                // EP#2
      ok  → si total == 0 → estado = vacio
            si total > 0  → estado = con-datos, renderizar tabla
      err → estado = error, muestra mensaje
  }

  P1C.cambiarPagina(nuevaPagina) {
    P1B.cargarInquilinos(nuevaPagina, limit)
  }
```

---

### Caso de uso 3: Ver detalle de inquilino

```ts
P1 — Lista de inquilinos
  P1D.verDetalleInquilino(id) {
    navegar a /inquilinos/:id              // P2
  }

P2 — Detalle de inquilino
  P2A.cargarInquilino(id)
```

---

### Caso de uso 4: Actualizar inquilino

```ts
P2 — Detalle de inquilino
  P2B.abrirModalEdicion() {
    abre D1 (precargado con datos del inquilino)
      ok (datosActualizados) → actualiza estado local con datosActualizados
  }

D1 — Modal Formulario inquilino
  D1C.actualizarInquilino(id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PATCH /inquilinos/:id              // EP#4
          ok  → cierra modal y emite datosActualizados
          err → muestra mensaje de error
      }
  }

  D1B.cancelar()
```

---
---

## Local

### Caso de uso 5: Registrar local

```ts
P3 — Lista de locales
  P3A.abrirModalRegistro() {
    abre D2
      ok (id) → navegar a /locales/:id     // P4
  }

D2 — Modal Formulario local
  D2A.registrarLocal() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /locales/register             // EP#5
          ok  → cierra modal y emite id
          err → muestra mensaje de error
      }
  }

  D2B.cancelar() {
    cierra modal
  }

P4 — Detalle de local
  P4A.cargarLocal(id) {
    estado = cargando
    datos = GET /locales/:id               // EP#7
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 6: Listar locales

```ts
P3 — Lista de locales
  P3B.cargarLocales(page = 1, limit = 10) {
    estado = cargando
    datos = GET /locales                   // EP#6
      ok  → si total == 0 → estado = vacio
            si total > 0  → estado = con-datos, renderizar tabla
      err → estado = error, muestra mensaje
  }

  P3C.cambiarPagina(nuevaPagina) {
    P3B.cargarLocales(nuevaPagina, limit)
  }
```

---

### Caso de uso 7: Ver detalle de local

```ts
P3 — Lista de locales
  P3D.verDetalleLocal(id) {
    navegar a /locales/:id                 // P4
  }

P4 — Detalle de local
  P4A.cargarLocal(id)
```

---

### Caso de uso 8: Actualizar local

```ts
P4 — Detalle de local
  P4B.abrirModalEdicion() {
    abre D2 (precargado con datos del local)
      ok (datosActualizados) → actualiza estado local con datosActualizados
  }

D2 — Modal Formulario local
  D2C.actualizarLocal(id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PATCH /locales/:id                 // EP#8
          ok  → cierra modal y emite datosActualizados
          err → muestra mensaje de error
      }
  }

  D2B.cancelar()
```

---
---

## Contrato

### Caso de uso 9: Crear contrato

```ts
P5 — Lista de contratos
  P5A.irACrearContrato() {
    navegar a /contratos/crear             // P6
  }

P6 — Crear contrato
  P6A.cargarSelectores() {
    estado = cargando
    inquilinos = GET /inquilinos           // EP#2
    locales    = GET /locales              // EP#6
      ok  → estado = listo, renderizar selectores
      err → estado = error, muestra mensaje
  }

  P6B.crearContrato() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos                    // EP#9
          ok (id) → navegar a /contratos/:id  // P7
          err     → muestra mensaje de error
      }
  }

P7 — Detalle de contrato
  P7A.cargarContrato(id) {
    estado = cargando
    datos = GET /contratos/:id             // EP#11
      ok  → estado = con-datos, renderizar cabecera, deuda y habilitar pestañas
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 10: Listar contratos

```ts
P5 — Lista de contratos
  P5B.cargarContratos(page = 1, limit = 10) {
    estado = cargando
    datos = GET /contratos                 // EP#10
      ok  → si total == 0 → estado = vacio
            si total > 0  → estado = con-datos, renderizar tabla
      err → estado = error, muestra mensaje
  }

  P5C.cambiarPagina(nuevaPagina) {
    P5B.cargarContratos(nuevaPagina, limit)
  }
```

---

### Caso de uso 11: Ver detalle de contrato

```ts
P5 — Lista de contratos
  P5D.verDetalleContrato(id) {
    navegar a /contratos/:id               // P7
  }

P7 — Detalle de contrato
  P7A.cargarContrato(id)
```

---

### Caso de uso 12: Actualizar contrato

```ts
P7 — Detalle de contrato
  P7B.abrirModalEdicion() {
    abre D3 (precargado con local y observaciones)
      ok → P7A.cargarContrato(id)
  }

D3 — Modal Editar contrato
  D3A.cargarLocalesLibres() {
    locales = GET /locales                 // EP#6
  }

  D3B.actualizarContrato(id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PATCH /contratos/:id               // EP#12
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D3C.cancelar() {
    cierra modal
  }
```

---

### Caso de uso 13: Cerrar contrato

```ts
P7 — Detalle de contrato
  P7C.solicitarCerrarContrato() {
    abre D5 (diálogo de confirmación)
      ok → estado local = cerrado
           deshabilita acciones de cobro y renovación
  }

D5 — Diálogo Confirmar cierre de contrato
  D5A.confirmarCierre(id) {
    PATCH /contratos/:id/cerrar            // EP#13
      ok  → cierra diálogo y emite éxito
      err → muestra mensaje de error
  }

  D5B.cancelar() {
    cierra diálogo
  }
```

---

### Caso de uso 14: Renovar contrato

```ts
P7 — Detalle de contrato
  P7D.abrirModalRenovacion() {
    abre D4
      ok → P7A.cargarContrato(id)
  }

D4 — Modal Renovar contrato
  D4A.renovarContrato(id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PATCH /contratos/:id/renovar       // EP#14
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D4B.cancelar() {
    cierra modal
  }
```

---
---

## Garantía

### Caso de uso 15: Ver detalle de garantía

```ts
P7 — Detalle de contrato (Pestaña Garantía)
  P7E.cargarGarantia(contrato_id) {
    estado = cargando
    datos = GET /garantias/:contrato_id    // EP#15
      ok  → estado = con-datos, renderizar tarjeta de balance
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 16: Listar movimientos de garantía

```ts
P7 — Detalle de contrato (Pestaña Garantía)
  P7F.cargarMovimientos(contrato_id, page = 1, limit = 10) {
    estado = cargando
    datos = GET /garantias/:contrato_id/movimientos  // EP#16
      ok  → si total == 0 → estado = vacio
            si total > 0  → estado = con-datos, renderizar tabla
      err → estado = error, muestra mensaje
  }

  P7G.cambiarPaginaMovimientos(nuevaPagina) {
    P7F.cargarMovimientos(contrato_id, nuevaPagina, limit)
  }
```

---

### Caso de uso 17: Registrar movimiento de garantía

```ts
P7 — Detalle de contrato (Pestaña Garantía)
  P7H.abrirModalMovimiento() {
    abre D6
      ok → P7E.cargarGarantia(contrato_id)
           P7F.cargarMovimientos(contrato_id)
  }

D6 — Modal Registrar movimiento de garantía
  D6A.registrarMovimiento(contrato_id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /garantias/:contrato_id/movimientos/registrar  // EP#17
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D6B.cancelar() {
    cierra modal
  }
```

---
---

## Alquiler y Cuotas

### Caso de uso 18: Listar cuotas de alquiler

```ts
P7 — Detalle de contrato (Pestaña Cuotas)
  P7I.cargarCuotas(contrato_id) {
    estado = cargando
    datos = GET /alquiler/:contrato_id/cuotas  // EP#18
      ok  → si vacio → estado = vacio
            si datos → estado = con-datos, renderizar cronograma
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 19: Ver detalle de cuota

```ts
P7 — Detalle de contrato (Pestaña Cuotas)
  P7J.verDetallePago(cuota_id) {
    abre D7 (con cuota_id)
  }

D7 — Modal Detalle de pago de cuota
  D7A.cargarPago(contrato_id, cuota_id) {
    estado = cargando
    datos = GET /alquiler/:contrato_id/cuotas/:id  // EP#19
      ok  → estado = con-datos, renderizar comprobante
      err → estado = error, muestra mensaje
  }

  D7B.cerrar() {
    cierra modal
  }
```

---

### Caso de uso 20: Registrar pago de alquiler

```ts
P7 — Detalle de contrato (Pestaña Cuotas)
  P7K.abrirModalPagoCuota(cuota) {
    abre D8 (precargado con monto exacto de la cuota)
      ok → actualiza estado de cuota a pagado en tabla local
           P7A.cargarContrato(contrato_id)  // Recalcula balance de deuda
  }

D8 — Modal Registrar pago de cuota
  D8A.registrarPago(contrato_id, cuota_id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /alquiler/:contrato_id/cuotas/:id/pagos  // EP#20
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D8B.cancelar() {
    cierra modal
  }
```

---
---

## Consumo de Luz

### Caso de uso 21: Registrar consumo de luz

```ts
P7 — Detalle de contrato (Pestaña Consumos)
  P7L.abrirModalRegistroConsumo() {
    abre D9
      ok → P7M.cargarConsumos(contrato_id)
           P7A.cargarContrato(contrato_id)  // Recalcula balance de deuda
  }

D9 — Modal Registrar consumo de luz
  D9A.registrarConsumo(contrato_id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /consumo/:contrato_id/registrar  // EP#21
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D9B.cancelar() {
    cierra modal
  }
```

---

### Caso de uso 22: Listar consumos de luz

```ts
P7 — Detalle de contrato (Pestaña Consumos)
  P7M.cargarConsumos(contrato_id) {
    estado = cargando
    datos = GET /consumo/:contrato_id/     // EP#22
      ok  → si vacio → estado = vacio
            si datos → estado = con-datos, renderizar tabla
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso 23: Ver detalle de consumo

```ts
P7 — Detalle de contrato (Pestaña Consumos)
  P7N.verDetalleConsumo(consumo_id) {
    abre D10 (con consumo_id)
  }

D10 — Modal Detalle de consumo de luz
  D10A.cargarDetalle(contrato_id, consumo_id) {
    estado = cargando
    datos = GET /consumo/:contrato_id/detalle/:id  // EP#23
      ok  → estado = con-datos, renderizar desglose y datos de pago
      err → estado = error, muestra mensaje
  }

  D10B.cerrar() {
    cierra modal
  }
```

---

### Caso de uso 24: Registrar pago de consumo

```ts
P7 — Detalle de contrato (Pestaña Consumos)
  P7O.abrirModalPagoConsumo(consumo) {
    abre D11 (precargado con monto exacto del consumo)
      ok → actualiza estado de consumo a pagado en tabla local
           P7A.cargarContrato(contrato_id)  // Recalcula balance de deuda
  }

D11 — Modal Registrar pago de consumo de luz
  D11A.registrarPago(contrato_id, consumo_id) {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /consumo/:contrato_id/pagar/:id  // EP#24
          ok  → cierra modal y emite éxito
          err → muestra mensaje de error
      }
  }

  D11B.cancelar() {
    cierra modal
  }
```

---
---

## Funcionalidades Transversales

### Caso de uso 25: Visualizar Dashboard

```ts
P8 — Dashboard
  P8A.cargarDashboard() {
    estado = cargando
    // Carga métricas generales y contadores
    ok  → estado = con-datos, renderizar tarjetas
    err → estado = error, muestra mensaje
  }

  P8B.irAInquilinos()    { navegar a /inquilinos }        // P1
  P8C.irALocales()       { navegar a /locales }           // P3
  P8D.irAContratos()     { navegar a /contratos }         // P5
  P8E.irACrearContrato() { navegar a /contratos/crear }   // P6
```

---

### Caso de uso 26: Iniciar y Cerrar Sesión

```ts
P0 — Iniciar sesión
  P0A.iniciarSesion() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /auth/login
          ok (token) → guardar sesión en storage
                       navegar a /dashboard       // P8
          err        → muestra mensaje de error
      }
  }

Layout — Barra superior
  L1A.cerrarSesion() {
    elimina sesión de storage
    navegar a /login                               // P0
  }
```
