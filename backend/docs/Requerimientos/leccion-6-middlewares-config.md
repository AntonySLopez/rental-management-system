# Lección 6: Middlewares Implementados y Futuros

## Middlewares Implementados

### Middleware Global de Errores

**Archivo**: `src/middleWare/global/errorGlobal.middleware.ts`

**Implementación**:
```typescript
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../flujo/appError.middleware.js';
import { ZodError } from 'zod';

function errorGlobalMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AppError && err.isOperational){
        const { statusCode, message } = err;
        console.error(err);
        res.status(statusCode).json({
            message: message
        })
    } else if(err instanceof ZodError){
        console.error(err);
        res.status(400).json({
            message: 'Bad estructure request',
            errors: err.issues
        })
    } else {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export default errorGlobalMiddleware;
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
import type { Request, Response, NextFunction } from 'express';
import env from '../../config/env.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../flujo/appError.middleware.js';

export function verificarToken(req: Request, res: Response, next: NextFunction) {
    // validar token existente
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new AppError('Token no proporcionado', 401);
    }
    // compara token con el que se generó
    jwt.verify(token, env.JWT_SECRET);
    next();
}
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


## Middlewares Futuros Necesarios

### Seguridad

#### Middleware de Autorización por Rol
- **Propósito**: Verificar permisos de usuario
- **Implementación sugerida**: Verificar roles/permisos antes de acceder a rutas

#### Middleware de Rate Limiting
- **Propósito**: Prevenir abuso de API limitando requests por IP
- **Librería sugerida**: `express-rate-limit`
- **Implementación**:
  ```typescript
  import rateLimit from 'express-rate-limit';
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite por IP
  });
  
  app.use(limiter);
  ```

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
