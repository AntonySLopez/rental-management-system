# Lección 3: Estructura de Carpetas y Módulos

## Estructura Actual
```
backend/src/
├── app.ts                    # Configuración Express
├── index.ts                  # Punto de entrada
├── config/                   # Configuraciones
│   ├── env.ts               # Variables de entorno
│   └── postgres.ts          # Pool de conexión
├── controller/              # Controladores HTTP
│   ├── auth.controller.ts
│   ├── contrato.controller.ts
│   ├── pago.controller.ts
│   ├── inquilino.controller.ts
│   ├── propiedad.controller.ts
│   ├── local.controller.ts
│   ├── garantia.controller.ts
│   ├── deuda.controller.ts
│   └── consumoLuz.controller.ts
├── service/                 # Lógica de negocio
│   ├── auth.service.ts
│   ├── contrato.service.ts
│   ├── pago.service.ts
│   ├── inquilino.service.ts
│   ├── propiedad.service.ts
│   ├── local.service.ts
│   ├── garantia.service.ts
│   ├── deuda.service.ts
│   └── consumoLuz.service.ts
├── repository/              # Acceso a datos
│   ├── auth.respository.ts
│   ├── contrato.repository.ts
│   ├── cuotaAlquiler.repository.ts
│   ├── pago.repository.ts
│   ├── inquilino.repository.ts
│   ├── propiedad.repository.ts
│   ├── local.repository.ts
│   ├── garantia.repository.ts
│   └── consumoLuz.repository.ts
├── schema/                  # DTOs Zod
│   ├── auth.DTO.ts
│   ├── crearContratoDTO.ts
│   ├── renovarContratoDTO.ts
│   ├── cerrarContratoDTO.ts
│   ├── registrarPagoDTO.ts
│   ├── registrarInquilinoDTO.ts
│   ├── registrarPropiedadDTO.ts
│   ├── registrarLocalDTO.ts
│   ├── gestionarGarantiaDTO.ts
│   ├── consultarDeudaDTO.ts
│   └── registrarConsumoLuzDTO.ts
├── types/                   # Tipos TypeScript
│   ├── auth.types.ts
│   ├── contrato.types.ts
│   ├── cuota.types.ts
│   ├── deuda.types.ts
│   ├── expressRequest.types.ts     # Extensión de Request: req.user.email
│   ├── garantia.types.ts
│   ├── movimiento.types.ts
│   ├── aplicacionPago.types.ts
│   ├── luz.types.ts
│   └── gestionGarantia.types.ts
├── routes/                  # Definición de rutas
│   ├── auth.routes.ts
│   ├── contrato.routes.ts
│   ├── pago.routes.ts
│   ├── inquilino.routes.ts
│   ├── propiedad.routes.ts
│   ├── local.routes.ts
│   ├── garantia.routes.ts
│   ├── deuda.routes.ts
│   └── luz.routes.ts
├── middleWare/              # Middlewares Express
│   └── global/
│       ├── autorizacionAdmin.middleware.ts
│       ├── errorGlobal.middleware.ts
│       ├── rateLimit.middleware.ts
│       └── verificarToken.middleware.ts
└── database/                # Esquema SQL
    └── CONTROL_ALQUILER.sql
```

## Módulos Implementados por Caso de Uso

### Módulo de Inquilinos
**Entidad**: `inquilino`

**Archivos implementados**:
- `controller/inquilino.controller.ts` ✅
- `service/inquilino.service.ts` ✅
- `repository/inquilino.repository.ts` ✅
- `routes/inquilino.routes.ts` ✅

**Endpoints implementados**:
- `POST /inquilino/registrar` - Registrar inquilino ✅

**Endpoints pendientes**:
- `GET /inquilino` - Listar inquilinos
- `GET /inquilino/:id` - Obtener inquilino
- `PUT /inquilino/:id` - Actualizar inquilino
- `DELETE /inquilino/:id` - Eliminar inquilino

**Dependencias**: Sin dependencias de otros módulos

### Módulo de Autenticación
**Entidad**: `usuario`

**Archivos implementados**:
- `controller/auth.controller.ts` ✅
- `service/auth.service.ts` ✅
- `repository/auth.respository.ts` ✅
- `routes/auth.routes.ts` ✅
- `schema/auth.DTO.ts` ✅
- `types/auth.types.ts` ✅

**Endpoints implementados**:
- `POST /auth/login` - Login de usuario ✅

**Endpoints pendientes**:
- `POST /auth/register` - Registro de usuario (seguridad: solo vía administración directa)

**Dependencias**: Sin dependencias de otros módulos

### Módulo de Propiedades
**Entidades**: `propiedad`, `local`

**Archivos implementados**:
- `controller/propiedad.controller.ts` ✅
- `service/propiedad.service.ts` ✅
- `repository/propiedad.repository.ts` ✅
- `routes/propiedad.routes.ts` ✅
- `controller/local.controller.ts` ✅
- `service/local.service.ts` ✅
- `repository/local.repository.ts` ✅
- `routes/local.routes.ts` ✅

**Endpoints implementados**:
- `POST /propiedad/registrar` - Registrar propiedad ✅
- `POST /local/registrar` - Registrar local ✅

**Endpoints pendientes**:
- `GET /propiedad` - Listar propiedades
- `GET /propiedad/:id` - Obtener propiedad
- `PUT /propiedad/:id` - Actualizar propiedad
- `DELETE /propiedad/:id` - Eliminar propiedad
- `GET /local` - Listar locales
- `GET /local/:id` - Obtener local
- `PUT /local/:id` - Actualizar local
- `DELETE /local/:id` - Eliminar local

**Dependencias**: Local depende de Propiedad

### Módulo de Contratos
**Entidad**: `contrato`

**Archivos implementados**:
- `controller/contrato.controller.ts` ✅
- `service/contrato.service.ts` ✅
- `repository/contrato.repository.ts` ✅
- `routes/contrato.routes.ts` ✅

**Endpoints implementados**:
- `POST /contrato/crear` - Crear contrato ✅
- `POST /contrato/renovar` - Renovar contrato ✅
- `POST /contrato/cerrar` - Cerrar contrato ✅

**Endpoints pendientes**:
- `GET /contrato` - Listar contratos
- `GET /contrato/:id` - Obtener contrato

**Dependencias**: Contrato depende de Inquilino, Local (indirectamente Propiedad), CuotaAlquiler, Garantía

### Módulo de Cuotas de Alquiler
**Entidad**: `cuota_alquiler`

**Archivos implementados**:
- `repository/cuotaAlquiler.repository.ts` ✅

**Operaciones**: Generación automática al crear contratos, consulta interna

**Nota**: Las cuotas se generan automáticamente al crear contratos, no tienen endpoints directos. Se gestionan internamente a través del módulo de Contratos.

**Dependencias**: CuotaAlquiler depende de Contrato

### Módulo de Consumo de Luz
**Entidad**: `consumo_luz`

**Archivos implementados**:
- `controller/consumoLuz.controller.ts` ✅
- `service/consumoLuz.service.ts` ✅
- `repository/consumoLuz.repository.ts` ✅
- `routes/luz.routes.ts` ✅

**Endpoints implementados**:
- `POST /luz/registrar/consumo` - Registrar consumo ✅

**Endpoints pendientes**:
- `GET /luz/:contratoId` - Listar consumos
- `GET /luz/detalle/:id` - Obtener consumo

**Dependencias**: ConsumoLuz depende de Contrato

### Módulo de Pagos
**Entidades**: `movimiento`, `aplicacion_pago_alquiler`, `aplicacion_pago_luz`

**Archivos implementados**:
- `controller/pago.controller.ts` ✅
- `service/pago.service.ts` ✅
- `repository/pago.repository.ts` ✅
- `repository/aplicacionPago.repository.ts` ✅
- `repository/movimiento.repository.ts` ✅
- `routes/pago.routes.ts` ✅

**Endpoints implementados**:
- `POST /pago/registrar` - Registrar pago ✅

**Endpoints pendientes**:
- `GET /pago/:contratoId` - Listar movimientos
- `GET /pago/movimiento/:id` - Obtener movimiento

**Dependencias**: Pago depende de Contrato, CuotaAlquiler, ConsumoLuz, Movimiento

### Módulo de Garantías
**Entidad**: `garantia`

**Archivos implementados**:
- `controller/garantia.controller.ts` ✅
- `service/garantia.service.ts` ✅
- `repository/garantia.repository.ts` ✅
- `routes/garantia.routes.ts` ✅

**Endpoints implementados**:
- `POST /garantia/devolver` - Devolver garantía ✅
- `POST /garantia/aplicar` - Aplicar garantía a deuda ✅

**Endpoints pendientes**:
- `POST /garantia/crear` - Crear garantía
- `POST /garantia/retener` - Retener garantía

**Dependencias**: Garantía depende de Contrato, Pago (cuando se aplica a deuda)

### Módulo de Deudas
**Entidades**: `cuota_alquiler`, `consumo_luz` (vistas consolidadas)

**Archivos implementados**:
- `controller/deuda.controller.ts` ✅
- `service/deuda.service.ts` ✅
- `routes/deuda.routes.ts` ✅

**Endpoints implementados**:
- `POST /deuda/consultar` - Consultar deuda ✅

**Endpoints pendientes**:
- `GET /deuda/pendientes/:contratoId` - Listar pendientes
- `GET /deuda/atrasados/:contratoId` - Listar atrasados

**Dependencias**: Deuda depende de Contrato, CuotaAlquiler, ConsumoLuz

## Convenciones de Nomenclatura

### Archivos
- **Controllers**: `{entidad}.controller.ts`
- **Services**: `{entidad}.service.ts`
- **Repositories**: `{entidad}.repository.ts`
- **DTOs**: `{accion}{Entidad}DTO.ts` (ej: `crearContratoDTO.ts`)
- **Types**: `{entidad}.types.ts`
- **Routes**: `{entidad}.routes.ts`

### Clases
- **Controllers**: `{Entidad}Controller`
- **Services**: `{Entidad}Service`
- **Repositories**: `{Entidad}Repository`

### Métodos
- **CRUD**: `findAll`, `findById`, `create`, `update`, `delete`
- **Específicos**: `{accion}{Entidad}` (ej: `saveAllCuotasForContrato`)

## Módulos de Infraestructura

### Config
- `env.ts` - Validación de variables de entorno
- `postgres.ts` - Pool de conexiones a PostgreSQL

### Middleware
- `errorGlobal.middleware.ts` - Manejo centralizado de errores (incluye errores JWT)
- `verificarToken.middleware.ts` - Verificación de tokens JWT en requests protegidos
- `rateLimit.middleware.ts` - Limitación de requests por IP

### Database
- `CONTROL_ALQUILER.sql` - Esquema completo de base de datos
