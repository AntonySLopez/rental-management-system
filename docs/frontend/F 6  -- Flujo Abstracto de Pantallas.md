
# Inquilino

### Caso de uso: Registrar inquilino

```ts
/dashboard           [P25] /// btn inquilinos
  -- /inquilinos     [P2]   // btn registrar inquilino
    -- /registrar    [P1]   // submit formulario → EP#1
  -- /inquilinos/:id [P3]   // automático → recibe id nuevo inquilino → EP#3
  
P1 — Registrar inquilino
{
  registrarInquilino()       // submit → EP#1
  → ok: emite id → P3.cargarInquilino(id)
  → err: muestra error
}

P3 — Detalle de inquilino
{
  cargarInquilino(id)        // onInit → EP#3
}

```

---

### Caso de uso: Listar inquilinos

```ts
/dashboard           [P25] /// btn inquilinos
  -- /inquilinos     [P2]   // carga automática → EP#2

P2 — Lista de inquilinos
{
  cargarInquilinos()         // onInit → EP#2
}
```

---

### Caso de uso: Ver detalle de inquilino

```ts
/dashboard             [P25] /// btn inquilinos
  -- /inquilinos       [P2]   // click fila inquilino
    -- /inquilinos/:id [P3]   // carga automática → EP#3

P3 — Detalle de inquilino
{
  cargarInquilino(id)        // onInit → EP#3
}
```

---

### Caso de uso: Actualizar inquilino

```ts
/dashboard                      [P25] /// btn inquilinos
  -- /inquilinos                [P2]   // click fila inquilino
    -- /inquilinos/:id          [P3]   // btn editar
      -- /inquilinos/:id/editar [P4]   // submit formulario → EP#4
    -- /inquilinos/:id          [P3]   // automático → recibe id inquilino actualizado → EP#3

P4 — Editar inquilino
{
  cargarInquilino(id)            // onInit → EP#3 (precarga form)
  actualizarInquilino()          // submit → EP#4
  → ok: emite id → P3.cargarInquilino(id)
  → err: muestra error
}
```

---
---


# Local

###  Caso de uso: Registrar local

```ts
/dashboard         [P25] /// btn locales
  -- /locales      [P6]   // btn registrar local
    -- /registrar  [P5]   // submit formulario → EP#5
  -- /locales/:id  [P7]   // automático → recibe id nuevo local → EP#7

P5 — Registrar local
{
  registrarLocal()           // submit → EP#5
  → ok: emite id → P7.cargarLocal(id)
  → err: muestra error
}

P7 — Detalle de local
{
  cargarLocal(id)            // onInit → EP#7
}
```

---

### Caso de uso: Listar locales

```ts
/dashboard         [P25] /// btn locales
  -- /locales      [P6]   // carga automática → EP#6

P6 — Lista de locales
{
  cargarLocales()            // onInit → EP#6
}
```

---

### Caso de uso: Ver detalle de local

```ts
/dashboard           [P25] /// btn locales
  -- /locales        [P6]   // click fila local
    -- /locales/:id  [P7]   // carga automática → EP#7

P7 — Detalle de local
{
  cargarLocal(id)            // onInit → EP#7
}
```

---

### Caso de uso: Actualizar local

```ts
/dashboard                   [P25] /// btn locales
  -- /locales                [P6]   // click fila local
    -- /locales/:id          [P7]   // btn editar
      -- /locales/:id/editar [P8]   // submit formulario → EP#8
    -- /locales/:id          [P7]   // automático → recibe id local actualizado → EP#7

P8 — Editar local
{
  cargarLocal(id)             // onInit → EP#7 (precarga form)
  actualizarLocal()           // submit → EP#8
  → ok: emite id → P7.cargarLocal(id)
  → err: muestra error
}
```

---
---


# Contrato

### Caso de uso: Crear contrato

```ts
/dashboard              [P25] /// btn contratos
  -- /contratos         [P10]  // btn crear contrato
    -- /contratos/crear [P9]   // carga selectores → EP#2, EP#6
                               // submit formulario → EP#9
  -- /contratos/:id     [P11]  // automático → recibe id nuevo contrato → EP#11

P9 — Crear contrato
{
  cargarSelectores()          // onInit → EP#2, EP#6
  crearContrato()             // submit → EP#9
  → ok: emite id → P11.cargarContrato(id)
  → err: muestra error
}
```

---

### Caso de uso: Listar contratos

```ts
/dashboard             [P25] /// btn contratos
  -- /contratos        [P10]  // carga automática → EP#10

P10 — Lista de contratos
{
  cargarContratos()           // onInit → EP#10
}
```

---

### Caso de uso: Ver detalle de contrato

```ts
/dashboard             [P25] /// btn contratos
  -- /contratos        [P10]  // click fila contrato
    -- /contratos/:id  [P11]  // carga automática → EP#11

P11 — Detalle de contrato
{
  cargarContrato(id)          // onInit → EP#11
}
```

---

### Caso de uso: Actualizar contrato

```ts
/dashboard                     [P25] /// btn contratos
  -- /contratos                [P10]  // click fila contrato
    -- /contratos/:id          [P11]  // btn editar
      -- /contratos/:id/editar [P12]  // carga formulario con datos → EP#11
                                       // submit formulario → EP#12
    -- /contratos/:id          [P11]  // automático → recibe id contrato actualizado → EP#11

P12 — Editar contrato
{
  cargarContrato(id)            // onInit → EP#11 (precarga form)
  actualizarContrato()          // submit → EP#12
  → ok: emite id → P11.cargarContrato(id)
  → err: muestra error
}
```

---

### Caso de uso: Cerrar contrato

```ts
/dashboard             [P25] /// btn contratos
  -- /contratos        [P10]  // click fila contrato
    -- /contratos/:id  [P11]  // btn cerrar contrato → confirmación
                               // confirma → EP#13
                               // actualiza estado en pantalla → cerrado

P11 — Detalle de contrato
{
  cerrarContrato(id)          // confirma → EP#13
  → ok: actualiza estado local → cerrado
  → err: muestra error
}
```

---

### Caso de uso: Renovar contrato

```ts
/dashboard             [P25] /// btn contratos
  -- /contratos        [P10]  // click fila contrato
    -- /contratos/:id  [P11]  // btn renovar contrato → confirmación
                               // confirma → EP#14
                               // automático → recarga pantalla → EP#11

P11 — Detalle de contrato
{
  renovarContrato(id)         // confirma → EP#14
  → ok: P11.cargarContrato(id)
  → err: muestra error
}
```

---
---

# Garantía

### Caso de uso: Ver detalle de garantía

```ts
/dashboard                       [P25] /// btn contratos
  -- /contratos                  [P10]  // click fila contrato
    -- /contratos/:id            [P11]  // btn garantía
      -- /contratos/:id/garantia [P15]  // carga automática → EP#15

P15 — Detalle de garantía
{
  cargarGarantia(id)              // onInit → EP#15
}
```

---

### Caso de uso: Listar movimientos de garantía

```ts
/dashboard                                     [P25] /// btn contratos
  -- /contratos                                [P10]  // click fila contrato
    -- /contratos/:id                          [P11]  // btn garantía
      -- /contratos/:id/garantia               [P15]  // btn ver movimientos
        -- /contratos/:id/garantia/movimientos [P16]  // carga automática → EP#16

P16 — Movimientos de garantía
{
  cargarMovimientos(id)           // onInit → EP#16
}
```

---

### Caso de uso: Registrar movimiento de garantía

```ts
/dashboard                                               [P25] /// btn contratos
  -- /contratos                                          [P10]  // click fila contrato
    -- /contratos/:id                                    [P11]  // btn garantía
      -- /contratos/:id/garantia                         [P15]  // btn registrar movimiento
        -- /contratos/:id/garantia/movimientos/registrar [P17]  // submit formulario → EP#17
      -- /contratos/:id/garantia                         [P15]  // automático → recarga pantalla → EP#15

P17 — Registrar movimiento de garantía
{
  registrarMovimiento()           // submit → EP#17
  → ok: emite id → P15.cargarGarantia(id)
  → err: muestra error
}
```

---
---


# Alquiler

### Caso de uso: Listar cuotas de alquiler

```ts
/dashboard                             [P25] /// btn contratos
  -- /contratos                        [P10]  // click fila contrato
    -- /contratos/:id                  [P11]  // btn cuotas
      -- /contratos/:id/cuotas         [P18]  // carga automática → EP#18

P18 — Lista de cuotas
{
  cargarCuotas(id)                // onInit → EP#18
}
```

---

### Caso de uso: Ver detalle de cuota

```ts
/dashboard                             [P25] /// btn contratos
  -- /contratos                        [P10]  // click fila contrato
    -- /contratos/:id                  [P11]  // btn cuotas
      -- /contratos/:id/cuotas         [P18]  // click fila cuota
        -- /contratos/:id/cuotas/:id   [P19]  // carga automática → EP#19

P19 — Detalle de cuota
{
  cargarCuota(id)                 // onInit → EP#19
}
```

---

### Caso de uso: Registrar pago de alquiler

```ts
/dashboard                                       [P25] /// btn contratos
  -- /contratos                                  [P10]  // click fila contrato
    -- /contratos/:id                            [P11]  // btn cuotas
      -- /contratos/:id/cuotas                   [P18]  // click fila cuota
        -- /contratos/:id/cuotas/:id             [P19]  // btn registrar pago
          -- /contratos/:id/cuotas/:id/registrar [P20]  // submit formulario → EP#20
        -- /contratos/:id/cuotas/:id             [P19]  // automático → recarga pantalla → EP#19

P20 — Registrar pago de alquiler
{
  registrarPago()                 // submit → EP#20
  → ok: emite id → P19.cargarCuota(id)
  → err: muestra error
}
```

---
---


# Consumo de luz

### Caso de uso: Registrar consumo de luz

```ts
/dashboard                                 [P25] /// btn contratos
  -- /contratos                            [P10]  // click fila contrato
    -- /contratos/:id                      [P11]  // btn consumos
      -- /contratos/:id/consumos/registrar [P21]  // submit formulario → EP#21
    -- /contratos/:id/consumos             [P22]  // automático → recarga lista → EP#22

P21 — Registrar consumo de luz
{
  registrarConsumo()              // submit → EP#21
  → ok: emite id → P22.cargarConsumos(id)
  → err: muestra error
}
```

---

### Caso de uso: Listar consumos de luz

```ts
/dashboard                             [P25] /// btn contratos
  -- /contratos                        [P10]  // click fila contrato
    -- /contratos/:id                  [P11]  // btn consumos
      -- /contratos/:id/consumos       [P22]  // carga automática → EP#22
      
P22 — Lista de consumos
{
  cargarConsumos(id)              // onInit → EP#22
}
```

---

### Caso de uso: Ver detalle de consumo

```ts
/dashboard                                 [P25] /// btn contratos
  -- /contratos                            [P10]  // click fila contrato
    -- /contratos/:id                      [P11]  // btn consumos
      -- /contratos/:id/consumos           [P22]  // click fila consumo
        -- /contratos/:id/consumos/:id     [P23]  // carga automática → EP#23

P23 — Detalle de consumo
{
  cargarConsumo(id)               // onInit → EP#23
}
```

---

### Caso de uso: Registrar pago de consumo

```ts
/dashboard                                        [P25] /// btn contratos
  -- /contratos                                   [P10]  // click fila contrato
    -- /contratos/:id                             [P11]  // btn consumos
      -- /contratos/:id/consumos                  [P22]  // click fila consumo
        -- /contratos/:id/consumos/:id            [P23]  // btn registrar pago
         -- /contratos/:id/consumos/:id/registrar [P24]  // submit formulario → EP#24
        -- /contratos/:id/consumos/:id            [P23]  // automático → recarga pantalla → EP#23

P24 — Registrar pago de consumo
{
  registrarPagoConsumo()          // submit → EP#24
  → ok: emite id → P23.cargarConsumo(id)
  → err: muestra error
}
```

---
---

