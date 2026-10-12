
---

## Inquilino

**#1 — POST /inquilinos** — Registrar nuevo inquilino — Retorna: Datos

**Reglas de dominio**

- documentoUnico() : El `documento` no debe debe existir en otro inquilino

```ts
// Entrada
interface NuevoInquilinoDto {
  nombre: string;  // no vacío ni solo espacios, máx. 200 caracteres
  telefono?: string;  // solo dígitos, máx. 9 caracteres
  email?: string;  // formato de email válido, máx. 100 caracteres
  documento: string;  // exactamente 8 dígitos numéricos
}

// Salida
interface NuevoInquilinoResponse {
  id: string;  // id del nuevo inquilino
}
```

---

**#2 — GET /inquilinos** — Listar inquilinos con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
interface ListarInquilinosDto {
  page?: number;   // query: entero, mínimo 1, default 1
  limit?: number;  // query: entero, mínimo 1, máximo 100, default 10
}

// Salida
interface InquilinoItem {
  id: string;
  nombre: string;
  telefono: string | null;
  documento: string;
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

- `inquilinoExiste()` : Existe un inquilino con el `id` recibido

```ts
// Entrada
interface DetalleInquilinoDto {
  id: number;  // params: entero, mínimo 1
}

// Salida
interface DetalleInquilinoResponse {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  documento: string;
  fecha_registro: string;
  estado: string;
}
```

---

**#4 — PATCH /inquilinos/:id** — Actualizar inquilino por id — Retorna: Datos

**Reglas de dominio**

- inquilinoExiste() : Existe un inquilino con el `id` recibido
- documentoUnico() : El `documento` no debe existir en otro inquilino

```ts
// Entrada
interface ActualizarInquilinoDto {
  id: number;          // params: entero, mínimo 1
  nombre?: string;     // no vacío ni solo espacios, máx. 200 caracteres
  telefono?: string;   // exactamente 9 dígitos numéricos
  email?: string;      // formato de email válido, máx. 100 caracteres
  documento: string;  // exactamente 8 dígitos numéricos
}

// Salida 
interface ActualizarInquilinoResponse { 
  id: string; // id del inquilino actualizado 
}
```

---

## Local

**#5 — POST /locales** — Registrar nuevo local — Retorna: Datos

**Reglas de dominio**

-  `nombreLocalUnico()` : El `nombre` no debe existir en otro local

```ts
// Entrada
interface NuevoLocalDto {
  nombre: string;       // no vacío ni solo espacios, máx. 100 caracteres
  descripcion?: string; // máx. 255 caracteres
  area: number;         // mayor que 0, máx. 2 decimales, máx. 1000
}

// Salida
interface NuevoLocalResponse {
  id: string;  // id del nuevo local
}
```

---

**#6 — GET /locales** — Listar locales con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
interface ListarLocalesDto {
  page?: number;   // query: entero, mínimo 1, default 1
  limit?: number;  // query: entero, mínimo 1, máximo 100, default 10
}

// Salida
interface LocalItem {
  id: string;
  nombre: string;
  area: number;
  estado: string;
}

interface ListarLocalesResponse {
  data: LocalItem[];
  total: number;  // total de páginas
  page: number;
  limit: number;
}
```

---

**#7 — GET /locales/:id** — Obtener detalle de local — Retorna: Datos

**Reglas de dominio**

- `localExiste()` : Existe un local con el `id` recibido

```ts
// Entrada
interface DetalleLocalDto {
  id: number;  // params: entero, mínimo 1
}

// Salida
interface DetalleLocalResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  area: number;
  estado: string;
}
```

---

**#8 — PATCH /locales/:id** — Actualizar local por id — Retorna: Datos

**Reglas de dominio**

- `localExiste()` : Existe un local con el `id` recibido
- `nombreLocalUnico()` : El `nombre` no debe existir en otro local

```ts
// Entrada
interface ActualizarLocalDto {
  id: number;            // params: entero, mínimo 1
  nombre: string;       // no vacío, máx. 100 caracteres, se aplica trim
  descripcion?: string;  // máx. 255 caracteres
  area?: number;         // mayor que 0, máx. 2 decimales, máx. 1000
}

// Salida
interface ActualizarLocalResponse {
  id: string;  // id del local actualizado
}
```

---

## Contrato

**#9 — POST /contratos** — Crear contrato, generar garantía y primera cuota — Retorna: Datos

**Reglas de dominio**

- `inquilinoExiste()` : Existe un inquilino con el `id` recibido
- `inquilinoActivo()` : El inquilino recibido tiene estado `activo`
- `localExiste()` : Existe un local con el `id` recibido
- `localLibre()` : El local recibido tiene estado `libre`

```ts
// Entrada
interface NuevoContratoDto {
  inquilino_id: number;         // entero, mínimo 1
  local_id: number;             // entero, mínimo 1
  precio_mensual: number;       // mayor que 0, máx. 2 decimales
  garantia: number;             // mayor que 0, máx. 2 decimales
  lectura_inicial_luz: number;  // mayor o igual a 0, máx. 2 decimales
  fecha_inicio: string;         // formato YYYY-MM-DD
  fecha_fin: string;            // formato YYYY-MM-DD, mayor a fecha_inicio
  observaciones?: string;       // máx. 255 caracteres
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito_bancario';  // pago de la primera cuota y garantia
  referencia?: string;          // máx. 100 caracteres
}

// Salida
interface NuevoContratoResponse {
  id: string;  // id del nuevo contrato
}
```

---

**#10 — GET /contratos** — Listar contratos con paginación — Retorna: Datos

**Reglas de dominio**

- Ninguna

```ts
// Entrada
interface ListarContratosDto {
  page?: number;   // query: entero, mínimo 1, default 1
  limit?: number;  // query: entero, mínimo 1, máximo 100, default 10
}

// Salida
interface ContratoItem {
  id: string;
  inquilino: string;       // nombre del inquilino
  local: string;           // nombre del local
  precio_mensual: number;
  fecha_inicio: string;    // YYYY-MM-DD
  fecha_fin: string;       // YYYY-MM-DD
  estado: string;
}

interface ListarContratosResponse {
  data: ContratoItem[];
  total: number;  // total de páginas
  page: number;
  limit: number;
}
```

---

**#11 — GET /contratos/:id** — Obtener detalles de contrato — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido

```ts
// Entrada
interface DetalleContratoDto {
  id: number;  // params: entero, mínimo 1
}

// Salida
interface InquilinoResumen {
  id: string;
  nombre: string;
  documento: string;
}

interface LocalResumen {
  id: string;
  nombre: string;
  area: number;
}

interface DeudaResumen {
  total_cuotas_adeudadas: number;    // importe de las cuotas en estado activo o atrasado
  total_consumos_pendientes: number;  // importe de los consumos en estado pendiente
  total_deuda: number;                // suma de los dos anteriores
}

interface DetalleContratoResponse {
  id: string;
  inquilino: InquilinoResumen;
  local: LocalResumen;
  precio_mensual: number;
  garantia: number;              // monto de la garantía del contrato
  lectura_inicial_luz: number;
  fecha_creacion: string;        // ISO 8601
  fecha_inicio: string;          // YYYY-MM-DD
  fecha_fin: string;             // YYYY-MM-DD
  observaciones: string | null;
  estado: string;
  deuda: DeudaResumen;
}
```

---

**#12 —PATCH /contratos/:id** — Actualizar contrato por id — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoVigente()` : El contrato recibido tiene estado `activo` o `renovado`
- `inquilinoExiste()` : Existe un inquilino con el `id` recibido
- `inquilinoActivo()` : El inquilino recibido tiene estado `activo`
- `localExiste()` : Existe un local con el `id` recibido
- `localLibre()` : El local recibido tiene estado `libre`

```ts
// Entrada
// debe recibir al menos un campo del body
interface ActualizarContratoDto {
  id: number;              // params: entero, mínimo 1
  inquilino_id?: number;   // entero, mínimo 1
  local_id: number;       // entero, mínimo 1
  observaciones?: string;  // máx. 255 caracteres
}

// Salida
interface ActualizarContratoResponse {
  id: string;  // id del contrato actualizado
}
```

---

**#13 — PATCH /contratos/:id/cerrar** — Cerrar contrato por id — Retorna: Booleano

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoVigente()` : El contrato recibido tiene estado `activo` o `renovado`

```ts
// Entrada
interface CerrarContratoDto {
  id: number;  // params: entero, mínimo 1
}

// Salida
interface CerrarContratoResponse {
  success: boolean;
  message: string;
}
```

---

**#14 — PATCH /contratos/:id/renovar** — Renovar contrato actualizando fechas y estado — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoActivo()` : El contrato recibido tiene estado `activo`
- `contratoSinDeuda()` : El contrato no tiene cuotas en estado `activo` o `atrasado` ni consumos en estado `pendiente`
- `fechaInicioValido()` : La `fecha_inicio` recibida es superior la fecha_fin de la ultima cuota pagada

```ts
// Entrada
interface RenovarContratoDto {
  id: number;               // params: entero, mínimo 1
  fecha_inicio: string;        // formato YYYY-MM-DD
  precio_mensual?: number;  // mayor que 0, máx. 2 decimales
  observaciones?: string;   // máx. 255 caracteres
}

// Salida
interface RenovarContratoResponse {
  id: string;  // id del contrato nuevo
}
```

---

## Garantía

**#15 — GET /garantias/:contrato_id** — Obtener garantía por contrato — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoTieneGarantia()` : El contrato recibido tiene una garantía registrada

```ts
// Entrada
interface DetalleGarantiaDto {
  contrato_id: number;  // params: entero, mínimo 1
}

// Salida
interface DetalleGarantiaResponse {
  id: string;
  contrato_id: string;
  monto: number;                 // monto de la garantía
  saldo: number;                 // depósitos - devoluciones - consumos
  fecha_registro: string;        // ISO 8601
  fecha_cierre: string | null;   // ISO 8601
  observaciones: string | null;
  estado: string;
}
```

---

**#16 — GET /garantias/:contrato_id/movimientos** — Listar movimientos de garantía — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoTieneGarantia()` : El contrato recibido tiene una garantía registrada

```ts
// Entrada
interface ListarMovimientosGarantiaDto {
  contrato_id: number;  // params: entero, mínimo 1
  page?: number;        // query: entero, mínimo 1, default 1
  limit?: number;       // query: entero, mínimo 1, máximo 100, default 10
}

// Salida
interface MovimientoGarantiaItem {
  id: string;
  fecha_registro: string;        // ISO 8601
  monto: number;
  metodo_pago: string;
  referencia: string | null;
  tipo_accion: string;
  observaciones: string | null;
}

interface ListarMovimientosGarantiaResponse {
  data: MovimientoGarantiaItem[];
  total: number;  // total de páginas
  page: number;
  limit: number;
}
```

---

**#17 — POST /garantias/:contrato_id/movimientos** — Registrar movimiento de garantía — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoTieneGarantia()` : El contrato recibido tiene una garantía registrada
- `garantiaRetenida()` : La garantía del contrato recibido tiene estado `retenida`
- `montoNoSuperaSaldoGarantia()` : El `monto` recibido no supera el saldo de la garantía del contrato

```ts
// Entrada
interface NuevoMovimientoGarantiaDto {
  contrato_id: number;   // params: entero, mínimo 1
  monto: number;         // mayor que 0, máx. 2 decimales, máx. 10000.00
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito_bancario';  // si tipo_accion es 'consumida', solo 'deposito_bancario'
  referencia?: string;   // máx. 100 caracteres
  tipo_accion: 'deposito' | 'devuelta' | 'consumida';
  observaciones?: string;  // máx. 255 caracteres
}

// Salida
interface NuevoMovimientoGarantiaResponse {
  id: string;  // id del nuevo movimiento
}
```

---

## Alquiler

**#18 — GET /contratos/:contrato_id/cuotas** — Listar cuotas de alquiler por contrato — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido

```ts
// Entrada
interface ListarCuotasDto {
  contrato_id: number;  // params: entero, mínimo 1
}

// Salida
interface CuotaItem {
  id: string;
  fecha_inicio: string;       // YYYY-MM-DD
  fecha_vencimiento: string;  // YYYY-MM-DD
  monto: number;
  estado: string;
}

interface ListarCuotasResponse {
  data: CuotaItem[];
}
```

---

**#19 — GET /contratos/:contrato_id/cuotas/:id** — Obtener pago de cuota por id — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `cuotaExiste()` : Existe una cuota con el `id` recibido que pertenece al contrato recibido
- `cuotaNoAnulada()` : La cuota recibida no tiene estado `anulada`

```ts
// Entrada
interface DetalleCuotaDto {
  contrato_id: number;        // params: entero, mínimo 1
  cuota_id: number;           // params: entero, mínimo 1
}

// Salida
interface PagoAlquilerResponse {
  id: string;
  monto: number;
  metodo_pago: string;
  referencia: string | null;
  fecha_registro: string;       // ISO 8601
  observaciones: string | null;
}
```

---

**#20 — POST /contratos/:contrato_id/cuotas/:id/pagos** — Registrar pago de alquiler — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoActivo()` : El contrato recibido tiene estado `activo`
- `cuotaExiste()` : Existe una cuota con el `id` recibido que pertenece al contrato recibido
- `cuotaPagable()` : La cuota recibida tiene estado `pendiente`, `activo` o `atrasado`
- `montoIgualAMontoCuota()` : El `monto` recibido es igual al monto de la cuota

```ts
// Entrada
interface NuevoPagoAlquilerDto {
  contrato_id: number;   // params: entero, mínimo 1
  id: number;            // params: entero, mínimo 1 (id de la cuota)
  monto: number;         // mayor que 0, máx. 2 decimales, máx. 10000
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito_bancario';
  referencia?: string;   // máx. 100 caracteres
  observaciones?: string;  // máx. 255 caracteres
}

// Salida
interface NuevoPagoAlquilerResponse {
  id: string;  // id del nuevo pago
}
```

---

## Consumo de Luz

**#21 — POST /contratos/:contrato_id/consumos** — Registrar consumo de luz — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoActivo()` : El contrato recibido tiene estado `activo`
- `lecturaAnteriorConsecutiva()` : La `lectura_anterior` recibida es igual a la `lectura_actual` del consumo más reciente del contrato que no esté `anulada`, o a la `lectura_inicial_luz` del contrato si no tiene consumos

```ts
// Entrada
interface NuevoConsumoDto {
  contrato_id: number;         // params: entero, mínimo 1
  fecha_inicio: string;        // formato YYYY-MM-DD, fecha válida
  fecha_fin: string;           // formato YYYY-MM-DD, fecha válida, igual o posterior a fecha_inicio
  lectura_anterior: number;    // mayor o igual a 0, máx. 2 decimales, máx. 10000.00
  lectura_actual: number;      // mayor o igual a lectura_anterior, máx. 2 decimales, máx. 10000.00
  precio_kwh: number;          // mayor que 0, máx. 4 decimales, máx. 10.0000
  alumbrado_publico?: number;  // mayor o igual a 0, máx. 2 decimales, máx. 10000.00, default 0
}

// Salida
interface NuevoConsumoResponse {
  id: string;  // id del nuevo consumo
}
```

---

**#22 — GET /contratos/:contrato_id/consumos** — Listar consumos de luz por contrato — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido

```ts
// Entrada
interface ListarConsumosDto {
  contrato_id: number;  // params: entero, mínimo 1
}

// Salida
interface ConsumoItem {
  id: string;
  fecha_inicio: string;       // YYYY-MM-DD
  fecha_fin: string;          // YYYY-MM-DD
  consumo_kwh_total: number;
  monto: number;
  estado: string;
}

interface ListarConsumosResponse {
  data: ConsumoItem[];
}
```

---

**#23 — GET /contratos/:contrato_id/consumos/:id** — Obtener consumo por id — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `consumoExiste()` : Existe un consumo con el `id` recibido que pertenece al contrato recibido
- `consumoNoAnulado()` : El consumo recibido no tiene estado `anulada`

```ts
// Entrada
interface DetalleConsumoDto {
  contrato_id: number;  // params: entero, mínimo 1
  id: number;           // params: entero, mínimo 1 (id del consumo)
}

// Salida
interface PagoConsumoItem {
  id: string;
  monto: number;
  metodo_pago: string;
  referencia: string | null;
  fecha_registro: string;       // ISO 8601
  observaciones: string | null;
}

interface DetalleConsumoResponse {
  id: string;
  contrato_id: string;
  fecha_inicio: string;         // YYYY-MM-DD
  fecha_fin: string;            // YYYY-MM-DD
  lectura_anterior: number;
  lectura_actual: number;
  consumo_kwh_total: number;
  precio_kwh: number;
  alumbrado_publico: number;
  monto: number;
  estado: string;
  pago: PagoConsumoItem | null;  // null si el consumo aún no tiene pago registrado
}
```

---

**#24 — POST /contratos/:contrato_id/consumos/:id/pagos** — Registrar pago de consumo — Retorna: Datos

**Reglas de dominio**

- `contratoExiste()` : Existe un contrato con el `id` recibido
- `contratoActivo()` : El contrato recibido tiene estado `activo`
- `consumoExiste()` : Existe un consumo con el `id` recibido que pertenece al contrato recibido
- `consumoPagable()` : El consumo recibido tiene estado `pendiente`
- `montoIgualAMontoConsumo()` : El `monto` recibido es igual al monto del consumo

```ts
// Entrada
interface NuevoPagoConsumoDto {
  contrato_id: number;     // params: entero, mínimo 1
  id: number;              // params: entero, mínimo 1 (id del consumo)
  monto: number;           // mayor que 0, máx. 2 decimales, máx. 1000.00
  metodo_pago: 'efectivo' | 'transferencia' | 'deposito_bancario';
  referencia?: string;     // máx. 100 caracteres
  observaciones?: string;  // máx. 255 caracteres
}

// Salida
interface NuevoPagoConsumoResponse {
  id: string;  // id del nuevo pago
}
```