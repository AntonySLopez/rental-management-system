# Sistema de Gestión de Alquileres - Backend

Backend API para el sistema de gestión de alquileres de propiedades, contratos, pagos y deudas.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Lenguaje**: TypeScript 6.0.3
- **Base de Datos**: PostgreSQL 8.21.0
- **Validación**: Zod 4.4.3
- **Package Manager**: pnpm 10.7.1
- **Autenticación**: JWT (jsonwebtoken), bcryptjs
- **Seguridad**: Helmet, CORS, express-rate-limit

## Características

- ✅ Arquitectura en capas (Routes → Controllers → DTOs → Services → Repositories → Database)
- ✅ Validación de datos con Zod
- ✅ Gestión de transacciones en PostgreSQL
- ✅ Autenticación JWT con verificación de tokens
- ✅ Middlewares de seguridad (Helmet, CORS, rate limiting, autorización por rol)
- ✅ Manejo centralizado de errores
- ✅ Tipado TypeScript estricto

## Instalación

```bash
pnpm install
```

## Configuración

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=rental_management
JWT_SECRET=your_secret_key
```

## Scripts

```bash
# Desarrollo
pnpm dev

# Producción
pnpm build
pnpm start

# Linting
pnpm lint
```

## Estructura del Proyecto

```
backend/src/
├── app.ts                    # Configuración Express
├── index.ts                  # Punto de entrada
├── config/                   # Configuraciones
│   ├── env.ts               # Variables de entorno
│   └── postgres.ts          # Pool de conexión
├── controller/              # Controladores HTTP
├── service/                 # Lógica de negocio
├── repository/              # Acceso a datos
├── schema/                  # DTOs Zod
├── types/                   # Tipos TypeScript
├── routes/                  # Definición de rutas
├── middleWare/              # Middlewares Express
│   └── global/
│       ├── errorGlobal.middleware.ts
│       ├── verificarToken.middleware.ts
│       ├── rateLimit.middleware.ts
│       └── autorizacionAdmin.middleware.ts
└── database/                # Esquema SQL
    └── CONTROL_ALQUILER.sql
```

## Endpoints Principales

### Autenticación
- `POST /auth/login` - Login de usuario (autenticación JWT)

### Inquilinos
- `POST /inquilino/registrar` - Registrar inquilino

### Propiedades
- `POST /propiedad/registrar` - Registrar propiedad
- `POST /local/registrar` - Registrar local

### Contratos
- `POST /contrato/crear` - Crear contrato
- `POST /contrato/renovar` - Renovar contrato
- `POST /contrato/cerrar` - Cerrar contrato

### Pagos y Deudas
- `POST /deuda/consultar` - Consultar deudas
- `POST /pago/registrar` - Registrar pago

### Servicios
- `POST /luz/registrar/consumo` - Registrar consumo luz
- `POST /garantia/devolver` - Devolver garantía
- `POST /garantia/aplicar` - Aplicar garantía a deuda

**Nota**: Actualmente todos los endpoints implementados son POST. Los endpoints GET, PUT, DELETE están pendientes de implementación.

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso desde diferentes orígenes
- **Rate Limiting**: 10 requests por minuto por IP
- **JWT**: Autenticación basada en tokens con expiración de 24 horas
- **Autorización por Rol**: Verificación de permisos de administrador

## Documentación

Para más detalles sobre la arquitectura, casos de uso y flujos internos, consulta la documentación en `docs/`:

- [Visión General del Sistema](docs/Requerimientos/leccion-1-vision-general.md)
- [Arquitectura Backend](docs/Requerimientos/leccion-2-arquitectura-backend.md)
- [Estructura de Carpetas](docs/Requerimientos/leccion-3-estructura-carpetas.md)
- [Casos de Uso CRUD](docs/Requerimientos/leccion-4-casos-uso-crud.md)
- [Flujo Interno](docs/Requerimientos/leccion-5-flujo-interno.md)
- [Middlewares](docs/Requerimientos/leccion-6-middlewares-config.md)

## Estado del Proyecto

✅ **Backend**: Completado y funcional
- Todos los módulos implementados
- Arquitectura definida
- Validación de datos implementada
- Gestión de transacciones activa
- Autenticación JWT implementada
- Middlewares de seguridad configurados

🚧 **Frontend**: En desarrollo
- Framework seleccionado: Astro
- Por definir: componentes, estado, integración con API

## Licencia

MIT