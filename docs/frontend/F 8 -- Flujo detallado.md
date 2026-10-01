
## Inquilino 
---
---

### Caso de uso: Registrar inquilino

```ts
P1 — Registrar inquilino
  registrarInquilino() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /inquilinos
          ok  → emite id a P3
                P3.cargarInquilino(id)
          err → muestra mensaje de error
      }
  }

P3 — Detalle de inquilino
  cargarInquilino(id) {
    estado = cargando
    datos = GET /inquilinos/:id
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Listar inquilinos

```ts
P2 — Lista de inquilinos
  cargarInquilinos() {
    estado = cargando
    datos = GET /inquilinos
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Ver detalle de inquilino

```ts
P3 — Detalle de inquilino
  cargarInquilino(id)  // → ver Registrar inquilino
```

---

### Caso de uso: Actualizar inquilino

```ts
P3 — Detalle de inquilino
  cargarInquilino(id)  // → ver Registrar inquilino

P4 — Editar inquilino
  cargarInquilino(id) {
    estado = cargando
    datos = GET /inquilinos/:id
      ok  → precarga formulario con datos
            estado = listo
      err → estado = error, muestra mensaje
  }

  actualizarInquilino() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PUT /inquilinos/:id
          ok  → emite id a P3
                P3.cargarInquilino(id)
          err → muestra mensaje de error
      }
  }
```

---

## local
---
---

### Caso de uso: Registrar local

```ts
P5 — Registrar local
  registrarLocal() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /locales
          ok  → emite id a P7
                P7.cargarLocal(id)
          err → muestra mensaje de error
      }
  }

P7 — Detalle de local
  cargarLocal(id) {
    estado = cargando
    datos = GET /locales/:id
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Listar locales

```ts
P6 — Lista de locales
  cargarLocales() {
    estado = cargando
    datos = GET /locales
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Ver detalle de local

```ts
P7 — Detalle de local
  cargarLocal(id)  // → ver Registrar local
```

---

### Caso de uso: Actualizar local

```ts
P7 — Detalle de local
  cargarLocal(id)  // → ver Registrar local

P8 — Editar local
  cargarLocal(id) {
    estado = cargando
    datos = GET /locales/:id
      ok  → precarga formulario con datos
            estado = listo
      err → estado = error, muestra mensaje
  }

  actualizarLocal() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PUT /locales/:id
          ok  → emite id a P7
                P7.cargarLocal(id)
          err → muestra mensaje de error
      }
  }
```

---

## Contrato
---
---

### Caso de uso: Crear contrato

```ts
P9 — Crear contrato
  cargarSelectores() {
    estado = cargando
    inquilinos = GET /inquilinos
    locales    = GET /locales
      ok  → estado = listo, renderizar selectores
      err → estado = error, muestra mensaje
  }

  crearContrato() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos
          ok  → emite id a P11
                P11.cargarContrato(id)
          err → muestra mensaje de error
      }
  }

P11 — Detalle de contrato
  cargarContrato(id) {
    estado = cargando
    datos = GET /contratos/:id
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Listar contratos

```ts
P10 — Lista de contratos
  cargarContratos() {
    estado = cargando
    datos = GET /contratos
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Ver detalle de contrato

```ts
P11 — Detalle de contrato
  cargarContrato(id)  // → ver Crear contrato
```

---

### Caso de uso: Actualizar contrato

```ts
P11 — Detalle de contrato
  cargarContrato(id)  // → ver Crear contrato

P12 — Editar contrato
  cargarContrato(id) {
    estado = cargando
    datos = GET /contratos/:id
      ok  → precarga formulario con datos
            estado = listo
      err → estado = error, muestra mensaje
  }

  actualizarContrato() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        PUT /contratos/:id
          ok  → emite id a P11
                P11.cargarContrato(id)
          err → muestra mensaje de error
      }
  }
```

---

### Caso de uso: Cerrar contrato

```ts
P11 — Detalle de contrato
  cerrarContrato(id) {
    confirmar con usuario
      canceló → no hacer nada
      confirmó {
        PATCH /contratos/:id/cerrar
          ok  → actualiza estado local → cerrado
                deshabilita botones cerrar y renovar
          err → muestra mensaje de error
      }
  }
```

---

### Caso de uso: Renovar contrato

```ts
P11 — Detalle de contrato
  renovarContrato(id) {
    confirmar con usuario
      canceló → no hacer nada
      confirmó {
        PATCH /contratos/:id/renovar
          ok  → cargarContrato(id)
          err → muestra mensaje de error
      }
  }
```

---

## Garantía 
---
---

### Caso de uso: Ver detalle de garantía

```ts
P15 — Detalle de garantía
  cargarGarantia(id) {
    estado = cargando
    datos = GET /contratos/:id/garantia
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Listar movimientos de garantía

```ts
P16 — Movimientos de garantía
  cargarMovimientos(id) {
    estado = cargando
    datos = GET /contratos/:id/garantia/movimientos
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Registrar movimiento de garantía

```ts
P15 — Detalle de garantía
  cargarGarantia(id)  // → ver Ver detalle de garantía

P17 — Registrar movimiento de garantía
  registrarMovimiento() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos/:id/garantia/movimientos
          ok  → emite id a P15
                P15.cargarGarantia(id)
          err → muestra mensaje de error
      }
  }
```

---

## Alquiler 
---
---

### Caso de uso: Listar cuotas de alquiler

```ts
P18 — Lista de cuotas
  cargarCuotas(id) {
    estado = cargando
    datos = GET /contratos/:id/cuotas
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Ver detalle de cuota

```ts
P19 — Detalle de cuota
  cargarCuota(id) {
    estado = cargando
    datos = GET /contratos/:id/cuotas/:id
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Registrar pago de alquiler

```ts
P19 — Detalle de cuota
  cargarCuota(id)  // → ver Ver detalle de cuota

P20 — Registrar pago de alquiler
  registrarPago() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos/:id/cuotas/:id/pagos
          ok  → emite id a P19
                P19.cargarCuota(id)
          err → muestra mensaje de error
      }
  }
```

---

## ConsumoLuz 
---
---

### Caso de uso: Registrar consumo de luz

```ts
P21 — Registrar consumo de luz
  registrarConsumo() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos/:id/consumos
          ok  → emite id a P22
                P22.cargarConsumos(id)
          err → muestra mensaje de error
      }
  }

P22 — Lista de consumos
  cargarConsumos(id) {
    estado = cargando
    datos = GET /contratos/:id/consumos
      ok  → estado = con-datos, renderizar lista
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Listar consumos de luz

```ts
P22 — Lista de consumos
  cargarConsumos(id)  // → ver Registrar consumo de luz
```

---

### Caso de uso: Ver detalle de consumo

```ts
P23 — Detalle de consumo
  cargarConsumo(id) {
    estado = cargando
    datos = GET /contratos/:id/consumos/:id
      ok  → estado = con-datos, renderizar
      err → estado = error, muestra mensaje
  }
```

---

### Caso de uso: Registrar pago de consumo

```ts
P23 — Detalle de consumo
  cargarConsumo(id)  // → ver Ver detalle de consumo

P24 — Registrar pago de consumo
  registrarPagoConsumo() {
    validar formulario
      inválido → mostrar errores de campo
      válido {
        POST /contratos/:id/consumos/:id/pagos
          ok  → emite id a P23
                P23.cargarConsumo(id)
          err → muestra mensaje de error
      }
  }
```

---

