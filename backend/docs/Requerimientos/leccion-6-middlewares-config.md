# Lección 6: Middlewares Implementados y Futuros

## Middlewares Implementados

### Middleware Global de Errores

**Archivo**: `src/middleWare/global/errorGlobal.middleware.ts`

**Implementación**:
```typescript
import errorGlobalMiddleware from '../../middleWare/global/errorGlobal.middleware.js';

app.use(errorGlobalMiddleware);

```

**Tipos de Errores Manejados**:
- **AppError**: Errores operacionales (isOperational = true)
- **ZodError**: Errores de validación de DTOs
- **JsonWebTokenError**: Token JWT inválido/malformado
- **TokenExpiredError**: Token JWT expirado
- **NotBeforeError**: Token JWT aún no válido
- **Error genérico**: Errores no especificados (500)

### Middleware de Parsing JSON

**Archivo**: `src/app.ts`

**Implementación**:
```typescript
app.use(express.json());
```

**Propósito**: Convierte automáticamente el body de requests HTTP a JSON

### Middleware de Helmet

**Archivo**: `src/app.ts`

**Implementación**:
```typescript
import helmet from 'helmet';

app.use(helmet());
```

**Propósito**: Agrega headers de seguridad HTTP para proteger la aplicación

### Middleware de Verificación de Token

**Archivo**: `src/middleWare/global/verificarToken.middleware.ts`

**Implementación**:
```typescript
import verificarToken from '../../middleWare/global/verificarToken.middleware.js';

app.use(verificarToken);
```

**Propósito**: Verifica tokens JWT en headers Authorization de requests protegidos

### Middleware de CORS

**Archivo**: `src/app.ts`

**Implementación**:
```typescript
import cors from 'cors';

// configura opciones para futuro
app.use(cors());
```

**Propósito**: Controlar acceso desde diferentes orígenes

## Middleware de Rate Limiting

**Archivo**: `src/middleWare/global/rateLimit.middleware.ts`

**Implementación**:
```typescript
import rateLimitMiddleware from '../../middleWare/global/rateLimit.middleware.js';

app.use(rateLimitMiddleware);

```

**Propósito**: Prevenir abuso de API limitando requests por IP

## middleware de Autorizacion por rol

**Archivo**: `src/middleWare/global/autorizacionPorRol.middleware.ts`

**Implementación**:
```typescript
import autorizacionAdmin from '../../middleWare/global/autorizacionAdmin.middleware.js';

app.use(autorizacionAdmin, routes);
```

**Propósito**: Verificar permisos de usuario por rol

## Middlewares Futuros Necesarios

### Seguridad

#### Middleware de Autorización por Rol
- **Propósito**: Verificar permisos de usuario
- **Implementación sugerida**: Verificar roles/permisos antes de acceder a rutas

#### Middleware de Sanitización
- **Propósito**: Prevenir inyección de código malicioso
- **Librería sugerida**: `express-mongo-sanitize` o similar

### Logging y Monitoreo

#### Middleware de Request Logging
- **Propósito**: Registrar todas las requests entrantes
- **Implementación sugerida**: Morgan o Winston
- **Información a registrar**: método, URL, IP, user-agent, response time

#### Middleware de Performance Monitoring
- **Propósito**: Medir tiempo de respuesta de endpoints
- **Implementación sugerida**: Middleware personalizado o APM

### Validación Adicional

#### Middleware de Validación de Schema
- **Propósito**: Validar estructura de requests beyond Zod
- **Implementación**: Integración con Zod schemas por ruta

### Compresión

#### Middleware de Compresión
- **Propósito**: Comprimir responses para reducir bandwidth
- **Librería sugerida**: `compression`

## Orden Sugerido de Middlewares

```
1. Helmet (seguridad headers)
2. CORS (control de origen)
3. Express JSON (parsing)
4. Rate Limiting (protección contra abuso)
5. Request Logging (monitoreo)
6. Authentication (autenticación JWT)
7. Authorization (autorización por rol)
8. Sanitización (limpieza de datos)
9. Routes (rutas de la aplicación)
10. Error Global (manejo de errores)
```

## Configuración de Variables de Entorno

### Variables Implementadas
```env
# JWT (implementado)
JWT_SECRET=your_secret_key
```

### Variables Adicionales para Middlewares Futuros
```env
# JWT
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```
