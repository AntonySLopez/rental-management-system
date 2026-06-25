# Lección 4: Casos de Uso Implementados

## Casos de Uso Implementados

### Login de Usuario
**Endpoint**: `POST /auth/login`

**DTO de Entrada**:
```typescript
{
  email: string (email válido),
  password: string (mínimo 8 caracteres)
}
```

**Validaciones**:
- Email: obligatorio, formato válido
- Password: obligatorio, mínimo 8 caracteres

**Efectos Secundarios**:
- Busca usuario por email en base de datos
- Verifica contraseña con bcrypt
- Genera token JWT con email del usuario (expiración: 24 horas)
- Retorna nombre del usuario y token

**Componentes**:
- auth.controller.ts
- auth.service.ts
- auth.respository.ts
- auth.DTO.ts

### Registrar Inquilino
**Endpoint**: `POST /inquilino/registrar`

**DTO de Entrada**:
```typescript
{
  nombre: string (min 3 caracteres),
  telefono?: string (min 9 caracteres),
  email?: string (email válido),
  documento: string (min 8 caracteres)
}
```

**Validaciones**:
- Nombre: obligatorio, mínimo 3 caracteres
- Documento: obligatorio, único, mínimo 8 caracteres
- Teléfono: opcional, mínimo 9 caracteres
- Email: opcional, formato válido

**Efectos Secundarios**:
- Crea registro en tabla `inquilino`
- Establece fecha de registro actual
- Estado por defecto: 'activo'

**Componentes**:
- inquilino.controller.ts
- inquilino.service.ts
- inquilino.repository.ts
- registrarInquilinoDTO.ts

### Registrar Propiedad
**Endpoint**: `POST /propiedad/registrar`

**DTO de Entrada**:
```typescript
{
  nombre: string,
  direccion: string,
  descripcion?: string
}
```

**Validaciones**:
- Nombre: obligatorio
- Dirección: obligatoria
- Descripción: opcional

**Efectos Secundarios**:
- Crea registro en tabla `propiedad`
- Estado por defecto: 'activo'

**Componentes**:
- propiedad.controller.ts
- propiedad.service.ts
- propiedad.repository.ts
- registrarPropiedadDTO.ts

### Registrar Local
**Endpoint**: `POST /local/registrar`

**DTO de Entrada**:
```typescript
{
  propiedadId: number,
  nombreLocal: string,
  descripcion?: string,
  area?: number
}
```

**Validaciones**:
- propiedadId: obligatorio, debe existir
- nombreLocal: obligatorio
- area: opcional, debe ser positivo

**Efectos Secundarios**:
- Crea registro en tabla `local`
- Vincula local a propiedad existente
- Estado por defecto: 'activo'

**Componentes**:
- local.controller.ts
- local.service.ts
- local.repository.ts
- registrarLocalDTO.ts

### Crear Contrato
**Endpoint**: `POST /contrato/crear`

**DTO de Entrada**:
```typescript
{
  inquilinoId: number,
  localId: number,
  precioMensual: number (positive),
  duracionMeses: number (positive int),
  fechaInicio: string,
  fechaFin: string,
  observacion?: string (min 10, max 200),
  lecturaAnterior: number (positive),
  garantia?: number (positive)
}
```

**Validaciones**:
- inquilinoId: obligatorio, debe existir
- localId: obligatorio, debe existir y estar disponible
- precioMensual: obligatorio, positivo
- duracionMeses: obligatorio, entero positivo
- fechas: obligatorias, formato válido
- lecturaAnterior: obligatorio, positivo
- garantia: opcional, positivo

**Efectos Secundarios**:
- Crea registro en tabla `contrato`
- Genera N cuotas en `cuota_alquiler` (una por cada mes de duración)
- Si se incluye garantía, crea registro en `garantia` con estado 'retenida'
- Actualiza estado del contrato a 'activo'

**Componentes**:
- contrato.controller.ts
- contrato.service.ts
- contrato.repository.ts
- cuotaAlquiler.repository.ts
- garantia.repository.ts
- crearContratoDTO.ts

### Renovar Contrato
**Endpoint**: `POST /contrato/renovar`

**DTO de Entrada**:
```typescript
{
  contratoId: number,
  duracionMeses: number (positive int),
  fechaInicio: string,
  fechaFin: string,
  lecturaAnterior: number (positive)
}
```

**Validaciones**:
- contratoId: obligatorio, debe existir
- duracionMeses: obligatorio, entero positivo
- fechas: obligatorias, formato válido
- lecturaAnterior: obligatorio, positivo

**Efectos Secundarios**:
- Actualiza estado del contrato anterior a 'renovado'
- Crea nuevo contrato vinculado al mismo inquilino y local
- Genera nuevas cuotas para el nuevo contrato
- Actualiza lectura anterior del medidor

**Componentes**:
- contrato.controller.ts
- contrato.service.ts
- contrato.repository.ts
- cuotaAlquiler.repository.ts
- renovarContratoDTO.ts

### Cerrar Contrato
**Endpoint**: `POST /contrato/cerrar`

**DTO de Entrada**:
```typescript
{
  contratoId: number,
  motivo?: string
}
```

**Validaciones**:
- contratoId: obligatorio, debe existir
- motivo: opcional

**Efectos Secundarios**:
- Actualiza estado del contrato a 'cerrado'
- Calcula saldo final de deudas
- Si hay garantía retenida, sugiere devolución o aplicación a deuda

**Componentes**:
- contrato.controller.ts
- contrato.service.ts
- contrato.repository.ts
- cerrarContratoDTO.ts

### Registrar Pago
**Endpoint**: `POST /pago/registrar`

**DTO de Entrada**:
```typescript
{
  contratoId: number,
  monto: number (positive),
  metodoPagoId: number,
  referencia?: string,
  descripcion?: string
}
```

**Validaciones**:
- contratoId: obligatorio, debe existir
- monto: obligatorio, positivo
- metodoPagoId: obligatorio, debe existir
- referencia: opcional
- descripcion: opcional

**Efectos Secundarios**:
- Crea registro en `movimiento`
- Obtiene deudas pendientes del contrato (cuotas y consumos)
- Distribuye monto automáticamente a deudas (por antigüedad)
- Crea registros en `aplicacion_pago_alquiler` y/o `aplicacion_pago_luz`
- Actualiza `monto_pagado` en cuotas/consumos
- Actualiza estado de deudas:
  - Si monto_pagado >= monto: estado = 'pagado'
  - Si monto_pagado > 0 y < monto: estado = 'parcial'

**Componentes**:
- pago.controller.ts
- pago.service.ts
- pago.repository.ts
- aplicacionPago.repository.ts
- movimiento.repository.ts
- cuotaAlquiler.repository.ts
- consumoLuz.repository.ts
- registrarPagoDTO.ts

### Consultar Deuda
**Endpoint**: `POST /deuda/consultar`

**DTO de Entrada**:
```typescript
{
  contratoId: number
}
```

**Validaciones**:
- contratoId: obligatorio, debe existir

**Efectos Secundarios**:
- Consulta cuotas pendientes (estado != 'pagado')
- Consulta consumos luz pendientes (estado != 'pagado')
- Calcula totales por tipo y general

**Response**:
```typescript
{
  contratoId: number,
  cuotas_pendientes: [
    {
      id: number,
      fecha_inicio: Date,
      monto: number,
      monto_pagado: number,
      estado: string
    }
  ],
  consumos_pendientes: [
    {
      id: number,
      fecha_inicio: Date,
      monto: number,
      monto_pagado: number,
      estado: string
    }
  ],
  total_alquiler: number,
  total_luz: number,
  total_general: number
}
```

**Componentes**:
- deuda.controller.ts
- deuda.service.ts
- cuotaAlquiler.repository.ts
- consumoLuz.repository.ts
- consultarDeudaDTO.ts

### Registrar Consumo de Luz
**Endpoint**: `POST /luz/registrar/consumo`

**DTO de Entrada**:
```typescript
{
  contratoId: number,
  fechaInicio: string,
  fechaFin: string,
  lecturaAnterior: number,
  lecturaActual: number,
  precioKwh: number,
  alumbradoPublico?: number
}
```

**Validaciones**:
- contratoId: obligatorio, debe existir
- fechas: obligatorias, formato válido
- lecturaAnterior: obligatorio, positivo
- lecturaActual: obligatorio, debe ser mayor a lecturaAnterior
- precioKwh: obligatorio, positivo
- alumbradoPublico: opcional

**Efectos Secundarios**:
- Calcula consumo_total = lectura_actual - lectura_anterior
- Calcula monto = (consumo_total * precio_kwh) + alumbrado_publico
- Crea registro en `consumo_luz`
- Estado por defecto: 'pendiente'

**Componentes**:
- consumoLuz.controller.ts
- consumoLuz.service.ts
- consumoLuz.repository.ts
- registrarConsumoLuzDTO.ts

### Devolver Garantía
**Endpoint**: `POST /garantia/devolver`

**DTO de Entrada**:
```typescript
{
  garantiaId: number
}
```

**Validaciones**:
- garantiaId: obligatorio, debe existir
- Estado actual debe ser 'retenida'

**Efectos Secundarios**:
- Actualiza estado de garantía a 'devuelta'
- Registra fecha de movimiento
- Desvincula movimiento (si estaba aplicada)

**Componentes**:
- garantia.controller.ts
- garantia.service.ts
- garantia.repository.ts
- gestionarGarantiaDTO.ts

### Aplicar Garantía a Deuda
**Endpoint**: `POST /garantia/aplicar`

**DTO de Entrada**:
```typescript
{
  garantiaId: number
}
```

**Validaciones**:
- garantiaId: obligatorio, debe existir
- Estado actual debe ser 'retenida'
- Debe haber deudas pendientes en el contrato

**Efectos Secundarios**:
- Verifica deudas pendientes del contrato
- Crea movimiento con monto = garantía.monto
- Distribuye monto a deudas pendientes
- Actualiza estado de garantía a 'aplicada_a_deuda'
- Vincula garantía al movimiento creado

**Componentes**:
- garantia.controller.ts
- garantia.service.ts
- garantia.repository.ts
- pago.service.ts
- movimiento.repository.ts
- aplicacionPago.repository.ts
- gestionarGarantiaDTO.ts

## Endpoints Pendientes

### Inquilinos
- `GET /inquilino` - Listar inquilinos
- `GET /inquilino/:id` - Obtener inquilino
- `PUT /inquilino/:id` - Actualizar inquilino
- `DELETE /inquilino/:id` - Eliminar inquilino

### Propiedades
- `GET /propiedad` - Listar propiedades
- `GET /propiedad/:id` - Obtener propiedad
- `PUT /propiedad/:id` - Actualizar propiedad
- `DELETE /propiedad/:id` - Eliminar propiedad

### Locales
- `GET /local` - Listar locales
- `GET /local/:id` - Obtener local
- `PUT /local/:id` - Actualizar local
- `DELETE /local/:id` - Eliminar local

### Contratos
- `GET /contrato` - Listar contratos
- `GET /contrato/:id` - Obtener contrato

### Pagos
- `GET /pago/:contratoId` - Listar movimientos
- `GET /pago/movimiento/:id` - Obtener movimiento

### Garantías
- `POST /garantia/crear` - Crear garantía
- `POST /garantia/retener` - Retener garantía

### Deudas
- `GET /deuda/pendientes/:contratoId` - Listar pendientes
- `GET /deuda/atrasados/:contratoId` - Listar atrasados

### Consumo Luz
- `GET /luz/:contratoId` - Listar consumos
- `GET /luz/detalle/:id` - Obtener consumo

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error de validación (DTO) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: documento duplicado) |
| 500 | Error interno del servidor |

## Errores Comunes

### Error de Validación (400)
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "nombre",
      "message": "El nombre debe tener al menos 3 caracteres"
    }
  ]
}
```

### Recurso No Encontrado (404)
```json
{
  "error": "Not found",
  "message": "Inquilino con id 123 no existe"
}
```

### Conflicto (409)
```json
{
  "error": "Conflict",
  "message": "El documento ya está registrado"
}
```

### Error Interno (500)
```json
{
  "error": "Internal server error",
  "message": "Error al procesar la solicitud"
}
```
