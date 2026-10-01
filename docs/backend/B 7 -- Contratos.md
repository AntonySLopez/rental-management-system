
---

## Inquilino

**#1 — POST /inquilinos** — Registrar nuevo inquilino — Retorna: Datos

**Reglas de dominio**

- El `documento` no debe estar registrado en otro inquilino con estado `activo`

```ts
// Entrada
interface NuevoInquilinoDto {
  nombre: string;
  telefono?: string;
  email?: string;
  documento: string;
}

// Salida
interface NuevoInquilinoResponse {
  id: number;  // id del nuevo inquilino
}
```

---

**#2 — GET /inquilinos** — Listar inquilinos con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
// query: page, limit

// Salida
interface InquilinoItem {
  id: number;
  nombre: string;
  documento: string;
  telefono: string | null;
  estado: string;
}

interface ListarInquilinosResponse {
  data: InquilinoItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#3 — GET /inquilinos/:id** — Obtener inquilino por id — Retorna: Datos

**Reglas de dominio**

- El inquilino debe existir en la base de datos

```ts
// Entrada
// params: id

// Salida
interface DetalleInquilinoResponse {
  id: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  documento: string;
  fecha_registro: string;
  estado: string;
}
```

---

**#4 — PUT /inquilinos/:id** — Actualizar inquilino por id — Retorna: Datos

**Reglas de dominio**

- El inquilino debe existir en la base de datos
- El `documento` no debe estar registrado en otro inquilino con estado `activo`

```ts
// Entrada
interface ActualizarInquilinoDto {
  nombre?: string;
  telefono?: string;
  email?: string;
  documento?: string;
}

// Salida
interface ActualizarInquilinoResponse {
  id: number;  // id del inquilino
}
```

---

## Local

**#5 — POST /locales** — Registrar nuevo local — Retorna: Datos

**Reglas de dominio**

- El `nombre` no debe estar registrado en otro local

```ts
// Entrada
interface NuevoLocalDto {
  nombre: string;
  descripcion?: string;
  area: number;
}

// Salida
interface NuevoLocalResponse {
  id: number;  // id del nuevo local
}
```

---

**#6 — GET /locales** — Listar locales con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
// query: page, limit

// Salida
interface LocalItem {
  id: number;
  nombre: string;
  area: number;
  estado: string;
}

interface ListarLocalesResponse {
  data: LocalItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#7 — GET /locales/:id** — Obtener detalle de local — Retorna: Datos

**Reglas de dominio**

- El local debe existir en la base de datos

```ts
// Entrada
// params: id

// Salida
interface DetalleLocalResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  area: number;
  estado: string;
}
```

---

**#8 — PUT /locales/:id** — Actualizar local por id — Retorna: Datos

**Reglas de dominio**

- El local debe existir en la base de datos
- El `nombre` no debe estar registrado en otro local

```ts
// Entrada
interface ActualizarLocalDto {
  nombre?: string;
  descripcion?: string;
  area?: number;
}

// Salida
interface ActualizarLocalResponse {
  id: number;  // id del local
}
```

---

## Contrato

**#9 — POST /contratos** — Crear contrato, generar garantía y primera cuota — Retorna: Datos

**Reglas de dominio**

- El inquilino debe existir y tener estado `activo`
- El local debe existir y tener estado `libre`
- La `fecha_inicio` debe ser anterior a `fecha_fin`

```ts
// Entrada
interface NuevoContratoDto {
  inquilino_id: number;
  local_id: number;
  precio_mensual: number;
  garantia: number;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones?: string;
}

// Salida
interface NuevoContratoResponse {
  id: number;  // id del nuevo contrato
}
```

---

**#10 — GET /contratos** — Listar contratos con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
// query: page, limit

// Salida
interface ContratoItem {
  id: number;
  inquilino: string;
  local: string;
  precio_mensual: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

interface ListarContratosResponse {
  data: ContratoItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#11 — GET /contratos/:id** — Obtener detalles de contrato — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos

```ts
// Entrada
// params: id

// Salida
interface InquilinoResumen {
  id: number;
  nombre: string;
  documento: string;
}

interface LocalResumen {
  id: number;
  nombre: string;
  area: number;
}

interface DeudaResumen { 
total_cuotas_pendientes: number; 
total_consumos_pendientes: number; 
total_deuda: number; }

interface DetalleContratoResponse {
  id: number;
  inquilino: InquilinoResumen;
  local: LocalResumen;
  precio_mensual: number;
  garantia: number;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string | null;
  estado: string;
  deuda: DeudaResumen;
}
```

---

**#12 — PUT /contratos/:id** — Actualizar contrato por id — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El estado del contrato debe ser `activo` o `renovado`

```ts
// Entrada
interface ActualizarContratoDto {
  precio_mensual?: number;
  fecha_fin?: string;
  observaciones?: string;
}

// Salida
interface ActualizarContratoResponse {
  id: number;  // id del contrato actualizado
}
```

---

**#13 — PATCH /contratos/:id/cerrar** — Cerrar contrato por id — Retorna: Booleano

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El estado del contrato debe ser `activo` o `renovado`

```ts
// Entrada
// params: id

// Salida
interface CerrarContratoResponse {
  success: boolean;
  message: string;
}
```

---

**#14 — PATCH /contratos/:id/renovar** — Renovar contrato actualizando fechas y estado — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El estado del contrato debe ser `activo`
- La nueva `fecha_fin` debe ser posterior a la `fecha_fin` actual

```ts
// Entrada
interface RenovarContratoDto {
  fecha_fin: string;
  precio_mensual?: number;
  observaciones?: string;
}

// Salida
interface RenovarContratoResponse {
  id: number;
}
```

---

## Garantía

**#15 — GET /garantias/:contrato_id** — Obtener garantía por contrato — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El contrato debe tener una garantía registrada

```ts
// Entrada
// params: contrato_id

// Salida
interface DetalleGarantiaResponse {
  id: number;
  contrato_id: number;
  monto_inicial: number;
  monto_actual: number;
  fecha_registro: string;
  fecha_cierre: string | null;
  observaciones: string | null;
  estado: string;
}
```

---

**#16 — GET /garantias/:contrato_id/movimientos** — Listar movimientos de garantía — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El contrato debe tener una garantía registrada

```ts
// Entrada
// params: contrato_id
// query: page, limit

// Salida
interface MovimientoGarantiaItem {
  id: number;
  fecha_registro: string;
  monto: number;
  metodo_pago: string;
  tipo_accion: string;
}

interface ListarMovimientosGarantiaResponse {
  data: MovimientoGarantiaItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#17 — POST /garantias/:contrato_id/movimientos** — Registrar movimiento de garantía — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- La garantía debe tener estado `deposito`
- El `monto` no debe superar el `monto_actual` de la garantía

```ts
// Entrada
interface NuevoMovimientoGarantiaDto {
  monto: number;
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito';
  referencia?: string;
  tipo_accion: 'devuelta' | 'consumida';
  observaciones?: string;
}

// Salida
interface NuevoMovimientoGarantiaResponse {
  id: number;  // id de de garantia
  contrato_id: number;  // id de de contrato
}
```

---

## Alquiler

**#18 — GET /contratos/:contrato_id/cuotas** — Listar cuotas de alquiler por contrato — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos

```ts
// Entrada
// params: contrato_id
// query: page, limit

// Salida
interface CuotaItem {
  id: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  monto: number;
  monto_pagado: number;
  estado: string;
}

interface ListarCuotasResponse {
  data: CuotaItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#19 — GET /contratos/:contrato_id/cuotas/:id** — Obtener cuota por id — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- La cuota debe existir y pertenecer al contrato

```ts
// Entrada
// params: contrato_id, id

// Salida
interface DetalleCuotaResponse {
  id: number;
  contrato_id: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  fecha_pago: string | null;
  monto: number;
  monto_pagado: number;
  estado: string;
}
```

---

**#20 — POST /contratos/:contrato_id/cuotas/:id/pagos** — Registrar pago de alquiler — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- La cuota debe existir y pertenecer al contrato
- El estado de la cuota debe ser `pendiente`, `activo`, `atrasado` o `parcial`
- El `monto` no debe superar el saldo pendiente de la cuota

```ts
// Entrada
interface NuevoPagoAlquilerDto {
  monto: number;
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito';
  referencia?: string;
  observaciones?: string;
}

// Salida
interface NuevoPagoAlquilerResponse {
  id: number;  // id de garantia
  contrato_id: number;  // id de contrato
}
```

---

## Consumo de Luz

**#21 — POST /contratos/:contrato_id/consumos** — Registrar consumo de luz — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir y tener estado `activo` o `renovado`
- No debe existir un consumo con estado `activo`, `atrasado` o `parcial` para el contrato

```ts
// Entrada
interface NuevoConsumoDto {
  fecha_inicio: string;
  fecha_fin: string;
  lectura_anterior: number;
  lectura_actual: number;
  precio_kwh: number;
  alumbrado_publico: number;
}

// Salida
interface NuevoConsumoResponse {
  id: number;  // id de consumo#
  contrato_id: number;  // id de contrato
}
```

---

**#22 — GET /contratos/:contrato_id/consumos** — Listar consumos de luz por contrato — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos

```ts
// Entrada
// params: contrato_id
// query: page, limit

// Salida
interface ConsumoItem {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  consumo_kwh_total: number;
  monto: number;
  monto_pagado: number;
  estado: string;
}

interface ListarConsumosResponse {
  data: ConsumoItem[];
  total: number;
  page: number;
  limit: number;
}
```

---

**#23 — GET /contratos/:contrato_id/consumos/:id** — Obtener consumo por id — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El consumo debe existir y pertenecer al contrato

```ts
// Entrada
// params: contrato_id, id

// Salida
interface DetalleConsumoResponse {
  id: number;
  contrato_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_pago: string | null;
  lectura_anterior: number;
  lectura_actual: number;
  precio_kwh: number;
  consumo_kwh_total: number;
  alumbrado_publico: number;
  monto: number;
  monto_pagado: number;
  estado: string;
}
```

---

**#24 — POST /contratos/:contrato_id/consumos/:id/pagos** — Registrar pago de consumo — Retorna: Datos

**Reglas de dominio**

- El contrato debe existir en la base de datos
- El consumo debe existir y pertenecer al contrato
- El estado del consumo debe ser `activo`, `atrasado` o `parcial`
- El `monto` no debe superar el saldo pendiente del consumo

```ts
// Entrada
interface NuevoPagoConsumoDto {
  monto: number;
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito';
  referencia?: string;
  observaciones?: string;
}

// Salida
interface NuevoPagoConsumoResponse {
  id: number;  // id de consumo
  contrato_id: number;  // id de contrato
}
```