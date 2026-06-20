# Lección 5: Flujo Interno de Casos de Uso

## Flujo 1: Crear Contrato

### Intención del Flujo
Validar disponibilidad de recursos, crear contrato y generar entidades secundarias (cuotas, consumo luz, garantía).

### Flujo Service (contrato.service.ts)
- Iniciar transacción
- Validar local disponible (localRepository)
- Validar inquilino existente (inquilinoRepository)
- Guardar contrato (contratoRepository)
- Actualizar local a ocupado (localRepository)
- Crear cuotas de alquiler (cuotaAlquilerRepository)
- Crear primer consumo de luz (consumoLuzRepository)
- Crear garantía si existe (garantiaRepository)
- Commit transacción

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 2: Registrar Pago

### Intención del Flujo
Registrar movimiento financiero y distribuir monto automáticamente entre deudas pendientes.

### Flujo Service (pago.service.ts)
- Iniciar transacción
- Verificar contrato existe (contratoRepository)
- Crear movimiento (movimientoRepository)
- Obtener deudas pendientes (cuotaAlquilerRepository + consumoLuzRepository)
- Distribuir monto a deudas por antigüedad
- Crear aplicaciones de pago (aplicacionPagoRepository)
- Actualizar montos pagados en deudas (cuotaAlquilerRepository + consumoLuzRepository)
- Actualizar estados de deudas según pago
- Commit transacción

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 3: Consultar Deuda

### Intención del Flujo
Obtener deudas pendientes de un contrato y calcular totales consolidados.

### Flujo Service (deuda.service.ts)
- Obtener cuotas pendientes (cuotaAlquilerRepository)
- Obtener consumos luz pendientes (consumoLuzRepository)
- Calcular total alquiler
- Calcular total luz
- Calcular total general
- Retornar estructura consolidada

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 4: Renovar Contrato

### Intención del Flujo
Validar estado actual, cerrar contrato anterior y crear nuevo contrato con datos actualizados.

### Flujo Service (contrato.service.ts)
- Iniciar transacción
- Validar contrato existe y está activo (contratoRepository)
- Validar deuda pendiente (deudaService)
- Actualizar contrato anterior a renovado (contratoRepository)
- Gestionar garantía: devolver (garantiaRepository + movimientoRepository)
- Crear objeto nuevo contrato con datos actualizados
- Crear nuevo contrato reutilizando flujo de creación
- Commit transacción

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 5: Cerrar Contrato

### Intención del Flujo
Validar contrato y actualizar su estado a cerrado.

### Flujo Service (contrato.service.ts)
- Validar contrato existe (contratoRepository)
- Cerrar contrato (contratoRepository)

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 6: Devolver Garantía

### Intención del Flujo
Validar garantía y actualizar su estado a devuelta.

### Flujo Service (garantia.service.ts)
- Validar garantía existe y está retenida (garantiaRepository)
- Actualizar estado a devuelta (garantiaRepository)
- Registrar fecha de movimiento

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 7: Aplicar Garantía a Deuda

### Intención del Flujo
Validar deudas pendientes y aplicar monto de garantía como pago.

### Flujo Service (garantia.service.ts)
- Iniciar transacción
- Validar garantía existe y está retenida (garantiaRepository)
- Validar deudas pendientes (deudaService)
- Crear movimiento con monto de garantía (movimientoRepository)
- Distribuir monto a deudas (pago.service)
- Actualizar estado de garantía a aplicada (garantiaRepository)
- Vincular garantía al movimiento (garantiaRepository)
- Commit transacción

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 8: Registrar Consumo de Luz

### Intención del Flujo
Calcular consumo y monto, luego registrar periodo de consumo.

### Flujo Service (consumoLuz.service.ts)
- Validar contrato existe (contratoRepository)
- Calcular consumo total
- Calcular monto (consumo * precio + alumbrado público)
- Crear registro consumo (consumoLuzRepository)

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 9: Registrar Inquilino

### Intención del Flujo
Validar datos y crear registro de inquilino.

### Flujo Service (inquilino.service.ts)
- Validar datos de entrada
- Crear inquilino (inquilinoRepository)

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 10: Registrar Propiedad

### Intención del Flujo
Validar datos y crear registro de propiedad.

### Flujo Service (propiedad.service.ts)
- Validar datos de entrada
- Crear propiedad (propiedadRepository)

### Response
```json
// (Por definir durante refactorización)
```

## Flujo 11: Registrar Local

### Intención del Flujo
Validar propiedad y crear registro de local vinculado.

### Flujo Service (local.service.ts)
- Validar datos de entrada
- Validar propiedad existe (propiedadRepository)
- Crear local (localRepository)

### Response
```json
// (Por definir durante refactorización)
```
