
---


## Inquilino

**#1 — POST /inquilinos/nuevo** — Registrar nuevo inquilino — Retorna: Datos

```ts
nuevoInquilino {
  RD.nuevoInquilino();       // documento no está registrado en un inquilino activo
  guardarInquilino();        // inserta el inquilino en la base de datos
  retornarDatos();           // retorna los datos del inquilino creado
}
```

**#2 — GET /inquilinos** — Listar inquilinos con paginación — Retorna: Datos

```ts
listarInquilinos {
  obtenerInquilinos();       // consulta inquilinos con paginación
  retornarDatos();           // retorna la lista paginada de inquilinos
}
```

**#3 — GET /inquilinos/:id** — Obtener inquilino por id — Retorna: Datos

```ts
detalleInquilino {
  RD.detalleInquilino();     // el inquilino existe en la base de datos
  obtenerInquilino();        // consulta todos los campos del inquilino
  retornarDatos();           // retorna los datos del inquilino
}
```

**#4 — PUT /inquilinos/:id** — Actualizar inquilino por id — Retorna: Datos

```ts
actualizarInquilino {
  RD.actualizarInquilino();  // el inquilino existe y el documento no pertenece a otro activo
  editarInquilino();         // actualiza los campos del inquilino en la base de datos
  retornarDatos();           // retorna los datos actualizados del inquilino
}
```

---

## Local

**#5 — POST /locales** — Registrar nuevo local — Retorna: Datos

```ts
nuevoLocal {
  RD.nuevoLocal();           // el nombre del local no está registrado
  guardarLocal();            // inserta el local en la base de datos
  retornarDatos();           // retorna los datos del local creado
}
```

**#6 — GET /locales** — Listar locales con paginación — Retorna: Datos

```ts
listarLocales {
  obtenerLocales();          // consulta locales con paginación
  retornarDatos();           // retorna la lista paginada de locales
}
```

**#7 — GET /locales/:id** — Obtener detalle de local — Retorna: Datos

```ts
detalleLocal {
  RD.detalleLocal();         // el local existe en la base de datos
  obtenerLocal();            // consulta todos los campos del local
  retornarDatos();           // retorna los datos del local
}
```

**#8 — PUT /locales/:id** — Actualizar local por id — Retorna: Datos

```ts
actualizarLocal {
  RD.actualizarLocal();      // el local existe y el nombre no pertenece a otro local
  editarLocal();             // actualiza los campos del local en la base de datos
  retornarDatos();           // retorna los datos actualizados del local
}
```

---

## Contrato

**#9 — POST /contratos** — Crear contrato, generar garantía y primera cuota — Retorna: Datos

```ts
nuevoContrato {
  RD.nuevoContrato();        // inquilino activo existe, local libre existe, fechas válidas
  transaction {
    guardarContrato();       // inserta el contrato en la base de datos
    guardarGarantia();       // genera el registro de garantía asociado al contrato
    generarPrimeraCuota();   // genera la primera cuota de alquiler del contrato
    actualizarEstadoLocal(); // cambia el estado del local a ocupado
    guardarConsumoLuz();     // inserta medidas del medidor de luz
  }
  retornarDatos();           // retorna los datos del contrato creado
}
```

**#10 — GET /contratos** — Listar contratos con paginación — Retorna: Datos

```ts
listarContratos {
  obtenerContratos();        // consulta contratos con paginación
  retornarDatos();           // retorna la lista paginada de contratos
}
```

**#11 — GET /contratos/:id** — Obtener detalles de contrato — Retorna: Datos

```ts
detalleContrato {
  RD.detalleContrato();      // el contrato existe en la base de datos
  obtenerContrato();         // consulta todos los campos del contrato
  retornarDatos();           // retorna los datos del contrato
}
```

**#12 — PUT /contratos/:id** — Actualizar contrato por id — Retorna: Datos

```ts
actualizarContrato {
  RD.actualizarContrato();   // el contrato existe y su estado permite edición
  editarContrato();          // actualiza los campos del contrato en la base de datos
  retornarDatos();           // retorna los datos actualizados del contrato
}
```

**#13 — PATCH /contratos/:id/cerrar** — Cerrar contrato por id — Retorna: Booleano

```ts
cerrarContrato {
  RD.cerrarContrato();       // el contrato existe y su estado es activo o renovado
  transaction {
    editarEstadoContrato();  // cambia el estado del contrato a cerrado
    actualizarEstadoLocal(); // cambia el estado del local a libre
  }
  retornarBooleano();        // confirma el cierre del contrato
}
```

**#14 — PATCH /contratos/:id/renovar** — Renovar contrato actualizando fechas y estado — Retorna: Datos

```ts
renovarContrato {
  RD.renovarContrato();      // el contrato existe y su estado es activo
  editarContrato();          // actualiza fechas y cambia el estado a renovado
  retornarDatos();           // retorna los datos actualizados del contrato
}
```

---

## Garantía

**#15 — GET /garantias/:contrato_id** — Obtener garantía por contrato — Retorna: Datos

```ts
detalleGarantia {
  RD.detalleGarantia();      // el contrato existe y tiene garantía registrada
  obtenerGarantia();         // consulta todos los campos de la garantía
  retornarDatos();           // retorna los datos de la garantía
}
```

**#16 — GET /garantias/:contrato_id/movimientos** — Listar movimientos de garantía — Retorna: Datos

```ts
listarMovimientosGarantia {
  RD.listarMovimientosGarantia();  // el contrato existe y tiene garantía registrada
  obtenerMovimientos();            // consulta movimientos con paginación
  retornarDatos();                 // retorna la lista paginada de movimientos
}
```

**#17 — POST /garantias/:contrato_id/movimientos** — Registrar movimiento de garantía — Retorna: Datos

```ts
nuevoMovimientoGarantia {
  RD.nuevoMovimientoGarantia();  // el contrato existe, garantía activa, monto no supera saldo
  transaction {
    guardarMovimiento();         // inserta el movimiento en la base de datos
    actualizarSaldoGarantia();   // actualiza monto_actual de la garantía
    evaluarEstadoGarantia();     // actualiza estado si saldo llega a cero
  }
  retornarDatos();               // retorna los datos del movimiento registrado
}
```

---

## Alquiler

**#18 — GET /contratos/:contrato_id/cuotas** — Listar cuotas de alquiler por contrato — Retorna: Datos

```ts
listarCuotas {
  RD.listarCuotas();         // el contrato existe en la base de datos
  obtenerCuotas();           // consulta cuotas del contrato con paginación
  retornarDatos();           // retorna la lista paginada de cuotas
}
```

**#19 — GET /contratos/:contrato_id/cuotas/:id** — Obtener cuota por id — Retorna: Datos

```ts
detalleCuota {
  RD.detalleCuota();         // el contrato existe y la cuota pertenece al contrato
  obtenerCuota();            // consulta todos los campos de la cuota
  retornarDatos();           // retorna los datos de la cuota
}
```

**#20 — POST /contratos/:contrato_id/cuotas/:id/pagos** — Registrar pago de alquiler — Retorna: Datos

```ts
nuevoPagoAlquiler {
  RD.nuevoPagoAlquiler();    // contrato existe, cuota pendiente o parcial, monto no supera saldo
  transaction {
    guardarPagoAlquiler();   // inserta el pago en la base de datos
    actualizarCuota();       // actualiza monto_pagado y estado de la cuota
    evaluarSiguienteCuota(); // genera la siguiente cuota si la actual queda pagada
  }
  retornarDatos();           // retorna los datos del pago registrado
}
```

---

## Consumo de Luz

**#21 — POST /contratos/:contrato_id/consumos** — Registrar consumo de luz — Retorna: Datos

```ts
nuevoConsumo {
  RD.nuevoConsumo();         // contrato activo existe, no hay consumo abierto sin pagar
  calcularConsumo();         // calcula consumo_kwh_total y monto desde lecturas y precio_kwh
  guardarConsumo();          // inserta el consumo en la base de datos
  retornarDatos();           // retorna los datos del consumo registrado
}
```

**#22 — GET /contratos/:contrato_id/consumos** — Listar consumos de luz por contrato — Retorna: Datos

```ts
listarConsumos {
  RD.listarConsumos();       // el contrato existe en la base de datos
  obtenerConsumos();         // consulta consumos del contrato con paginación
  retornarDatos();           // retorna la lista paginada de consumos
}
```

**#23 — GET /contratos/:contrato_id/consumos/:id** — Obtener consumo por id — Retorna: Datos

```ts
detalleConsumo {
  RD.detalleConsumo();       // el contrato existe y el consumo pertenece al contrato
  obtenerConsumo();          // consulta todos los campos del consumo
  retornarDatos();           // retorna los datos del consumo
}
```

**#24 — POST /contratos/:contrato_id/consumos/:id/pagos** — Registrar pago de consumo — Retorna: Datos

```ts
nuevoPagoConsumo {
  RD.nuevoPagoConsumo();     // contrato existe, consumo pendiente o parcial, monto no supera saldo
  transaction {
    guardarPagoConsumo();    // inserta el pago en la base de datos
    actualizarConsumo();     // actualiza monto_pagado y estado del consumo
  }
  retornarDatos();           // retorna los datos del pago registrado
}
```