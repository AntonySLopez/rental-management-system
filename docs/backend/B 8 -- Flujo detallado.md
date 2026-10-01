
---

## B8 — Inquilinos

**#1 — POST /inquilinos — Registrar nuevo inquilino**

```
nuevoInquilino {

  RD.nuevoInquilino:
    - no existe un inquilino con el mismo documento en la base de datos

  guardarInquilino()      // inserta el inquilino en la base de datos
  retornarDatos()         // retorna los datos del inquilino creado
}
```

---

**#2 — GET /inquilinos — Listar inquilinos con paginación**

```
listarInquilinos {

  obtenerInquilinos()     // consulta inquilinos con paginación
  retornarDatos()         // retorna la lista paginada de inquilinos
}
```

---

**#3 — GET /inquilinos/:id — Obtener inquilino por id**

```
detalleInquilino {

  RD.detalleInquilino:
    - existe un inquilino con el {id} recibido

  obtenerInquilino()      // consulta todos los campos del inquilino
  retornarDatos()         // retorna los datos del inquilino
}
```

---

**#4 — PUT /inquilinos/:id — Actualizar inquilino**

```
actualizarInquilino {

  RD.actualizarInquilino:
    - existe un inquilino con el {id} recibido
    - el documento recibido no pertenece a otro inquilino distinto

  editarInquilino()       // actualiza solo los campos recibidos en el DTO
  retornarDatos()         // retorna los datos actualizados del inquilino
}
```

---
---

## B8 — Locales

**#5 — POST /locales — Registrar nuevo local**

```
nuevoLocal {

  RD.nuevoLocal:
    - no existe un local con el mismo nombre en la base de datos

  guardarLocal()          // inserta el local en la base de datos
  retornarDatos()         // retorna los datos del local creado
}
```

---

**#6 — GET /locales — Listar locales con paginación**

```
listarLocales {

  obtenerLocales()        // consulta locales con paginación
  retornarDatos()         // retorna la lista paginada de locales
}
```

---

**#7 — GET /locales/:id — Obtener detalle de local**

```
detalleLocal {

  RD.detalleLocal:
    - existe un local con el {id} recibido

  obtenerLocal()          // consulta todos los campos del local
  retornarDatos()         // retorna los datos del local
}
```

---

**#8 — PUT /locales/:id — Actualizar local**

```
actualizarLocal {

  RD.actualizarLocal:
    - existe un local con el {id} recibido
    - el nombre recibido no pertenece a otro local distinto

  editarLocal()           // actualiza solo los campos recibidos en el DTO
  retornarDatos()         // retorna los datos actualizados del local
}
```

---
---

## B8 — Contratos

**#9 — POST /contratos — Crear contrato**

```
nuevoContrato {

  RD.nuevoContrato:
    - existe un inquilino con el {inquilino_id} recibido y está activo
    - existe un local con el {local_id} recibido y su estado es 'libre'
    - fecha_fin > fecha_inicio

  transaction {
    guardarContrato()           // inserta el contrato, retorna contrato_id
    guardarGarantia()           // crea garantía vinculada al contrato_id
    generarPrimeraCuota()       // genera cuota con fecha y monto calculados
    actualizarEstadoLocal()     // marca el local como ocupado
    guardarConsumoLuz()         // registra la lectura inicial del medidor
  }

  retornarDatos()               // retorna los datos del contrato creado
}
```

---

**#10 — GET /contratos — Listar contratos con paginación**

```
listarContratos {

  obtenerContratos()            // consulta contratos con paginación
  retornarDatos()               // retorna la lista paginada de contratos
}
```

---

**#11 — GET /contratos/:id — Obtener detalle de contrato**

```
detalleContrato {

  RD.detalleContrato:
    - existe un contrato con el {id} recibido

  obtenerContrato()             // consulta todos los campos del contrato
  retornarDatos()               // retorna los datos del contrato
}
```

---

**#12 — PUT /contratos/:id — Actualizar contrato**

```
actualizarContrato {

  RD.actualizarContrato:
    - existe un contrato con el {id} recibido
    - el estado del contrato es 'activo' o 'renovado'

  editarContrato()              // actualiza solo los campos recibidos en el DTO
  retornarDatos()               // retorna los datos actualizados del contrato
}
```

---

**#13 — PATCH /contratos/:id/cerrar — Cerrar contrato**

```
cerrarContrato {

  RD.cerrarContrato:
    - existe un contrato con el {id} recibido
    - el estado del contrato es 'activo' o 'renovado'

  transaction {
    editarEstadoContrato()      // cambia el estado del contrato a 'cerrado'
    actualizarEstadoLocal()     // marca el local como libre
  }

  retornarBooleano()            // confirma el cierre del contrato
}
```

---

**#14 — PATCH /contratos/:id/renovar — Renovar contrato**

```
renovarContrato {

  RD.renovarContrato:
    - existe un contrato con el {id} recibido
    - el estado del contrato es 'activo'
    - la nueva fecha_fin es posterior a la fecha_fin actual

  editarContrato()              // actualiza fechas y cambia estado a 'renovado'
  retornarDatos()               // retorna los datos actualizados del contrato
}
```

---
---

Perfecto, con eso tengo todo claro. Aquí el tramo Garantías:

---

## B8 — Garantías

**#15 — GET /garantias/:contrato_id — Obtener garantía por contrato**

```
detalleGarantia {

  RD.detalleGarantia:
    - existe un contrato con el {contrato_id} recibido
    - el contrato tiene una garantía registrada

  obtenerGarantia()             // consulta todos los campos de la garantía
  retornarDatos()               // retorna los datos de la garantía
}
```

---

**#16 — GET /garantias/:contrato_id/movimientos — Listar movimientos de garantía**

```
listarMovimientosGarantia {

  RD.listarMovimientosGarantia:
    - existe un contrato con el {contrato_id} recibido
    - el contrato tiene una garantía registrada

  obtenerMovimientos()          // consulta movimientos con paginación
  retornarDatos()               // retorna la lista paginada de movimientos
}
```

---

**#17 — POST /garantias/:contrato_id/movimientos — Registrar movimiento de garantía**

```
nuevoMovimientoGarantia {

  RD.nuevoMovimientoGarantia:
    - existe un contrato con el {contrato_id} recibido
    - la garantía del contrato tiene estado 'activo'
    - el monto del movimiento no supera el saldo actual de la garantía

  transaction {
    guardarMovimiento()         // inserta el movimiento en la base de datos
    actualizarSaldoGarantia()   // suma o descuenta según el tipo de movimiento
    evaluarEstadoGarantia()     // cambia estado a 'agotado' si el saldo llega a cero
  }

  retornarDatos()               // retorna los datos del movimiento registrado
}
```

---
---

