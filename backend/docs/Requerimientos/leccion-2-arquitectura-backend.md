# Lección 2: Arquitectura Backend

## Flujo de Datos
```
HTTP Request → Route → Controller → DTO (Validación) → Service → Repository → Database
```

## Componentes por Capa

### 1. Routes (`src/routes/`)
- Definen endpoints HTTP y los vinculan a controllers
- Manejan agrupación de rutas por módulo
- Ejemplo: `/contrato`, `/pago`, `/inquilino`

**Responsabilidades**:
- Definir verbos HTTP (GET, POST, PUT, DELETE)
- Extraer parámetros de URL
- Vincular rutas a controllers específicos
- Agrupar rutas por dominio de negocio

### 2. Controllers (`src/controller/`)
- Manejan requests y responses HTTP
- Extraen y validan datos del request
- Delegan lógica de negocio a services
- Manejan códigos de estado HTTP

**Responsabilidades**:
- Parsear body, params, query de requests
- Invocar servicios correspondientes
- Formatear responses HTTP
- Manejar errores HTTP (400, 404, 500, etc.)

### 3. DTOs/Schemas (`src/schema/`)
- Definen estructura de datos con Zod
- Validan entrada de datos
- Tipan los objetos de transferencia
- Ejemplos: `crearContratoDTO`, `registrarInquilinoDTO`

**Responsabilidades**:
- Definir schema de validación
- Validar tipos, formatos, restricciones
- Proporcionar mensajes de error descriptivos
- Generar tipos TypeScript automáticamente

### 4. Services (`src/service/`)
- Contienen lógica de negocio
- Orquestan operaciones entre múltiples repositorios
- Manejan transacciones de base de datos
- Implementan reglas de negocio complejas

**Responsabilidades**:
- Coordinar múltiples operaciones de repositorios
- Implementar reglas de negocio
- Manejar transacciones (BEGIN/COMMIT/ROLLBACK)
- Calcular derivados y agregaciones
- Validar reglas de negocio complejas

### 5. Repositories (`src/repository/`)
- Acceso directo a base de datos
- Ejecutan queries SQL
- Manejan conexiones y transacciones
- Retornan entidades mapeadas

**Responsabilidades**:
- Ejecutar queries SQL
- Mapear resultados a objetos
- Manejar conexiones a base de datos
- Implementar patrones de acceso a datos
- Soportar transacciones externas

### 6. Database (`src/database/`)
- Archivo SQL con esquema completo
- Definición de tablas y relaciones
- Datos iniciales de configuración

**Responsabilidades**:
- Definir estructura de tablas
- Establecer relaciones (foreign keys)
- Insertar datos de configuración inicial
- Documentar esquema de base de datos

## Flujo Completo de Ejemplo (Crear Contrato)

```
POST /contrato
  ↓
contrato.routes.ts
  - Recibe request POST
  - Extrae body
  - Invoca contrato.controller.crearContrato()
  ↓
contrato.controller.ts
  - Recibe datos validados
  - Llama a contrato.service.crearContrato()
  - Maneja errores y responses
  ↓
crearContratoDTO (Zod)
  - Valida: inquilinoId (number)
  - Valida: localId (number)
  - Valida: precioMensual (positive number)
  - Valida: duracionMeses (positive int)
  - Valida: fechas (strings válidas)
  - Valida: lecturaAnterior (positive number)
  - Retorna datos validados o lanza error
  ↓
contrato.service.ts
  - Verifica que inquilino existe (inquilino.repository)
  - Verifica que local está disponible (local.repository)
  - Inicia transacción DB
  - Crea contrato (contrato.repository)
  - Si hay garantía, crea registro (garantia.repository)
  - Genera N cuotas (cuotaAlquiler.repository)
  - Para cada cuota:
    * Calcula fecha inicio (mes actual + i)
    * Calcula fecha fin (mes siguiente, último día)
    * Establece monto = precioMensual
    * Estado = 'pendiente'
  - Commit transacción
  - Retorna contrato creado
  ↓
contrato.repository.ts
  - INSERT INTO contrato (inquilino_id, local_id, ...)
  - RETURNING *
  ↓
cuotaAlquiler.repository.ts
  - saveAllCuotasForContrato(cuota, cantidad)
  - BEGIN transacción
  - Loop N veces:
    * INSERT INTO cuota_alquiler
  - COMMIT
  - En error: ROLLBACK
  ↓
PostgreSQL
  - Persiste contrato
  - Persiste N cuotas
  - Actualiza local.contrato_id (si aplica)
  ↓
Response
  - 201 Created
  - JSON con contrato creado
```

## Patrón de Transacciones

### Transacción desde Service
```typescript
async crearContrato(datos) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Operación 1
    await contratoRepository.create(datos, client);
    
    // Operación 2
    await cuotaRepository.generarCuotas(datos, client);
    
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Transacción desde Repository
```typescript
async saveAllCuotasForContrato(cuota, cantidad, cliente?) {
  const client = await (cliente ?? pool.connect());
  try {
    await client.query('BEGIN');
    
    for (let i = 0; i < cantidad; i++) {
      await insertaCuota(cuota, i, client);
    }
    
    await client.query('COMMIT');
    return cuota;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}
```

## Separación de Responsabilidades

| Capa | Responsabilidad Principal | No debe hacer |
|------|--------------------------|---------------|
| Routes | Enrutar requests HTTP | Lógica de negocio |
| Controllers | Manejar HTTP | Acceso directo a DB |
| DTOs | Validar datos | Lógica de negocio |
| Services | Lógica de negocio | Manejo HTTP |
| Repositories | Acceso a datos | Lógica de negocio |

## Beneficios de esta Arquitectura

1. **Maintenibilidad**: Cada capa tiene responsabilidad única
2. **Testabilidad**: Cada componente puede testearse independientemente
3. **Escalabilidad**: Fácil agregar nuevas funcionalidades
4. **Reutilización**: Services y repositories pueden reutilizarse
5. **Flexibilidad**: Fácil cambiar implementación de una capa
