# Sistema de Gestión de Alquileres — Backend API

Backend API RESTful modular para el **Sistema de Gestión de Alquileres**, diseñado bajo los principios de **Vertical Slice Architecture** (arquitectura por dominios/features) y **Domain-Driven Design (DDD)** con validación estricta, reglas de negocio desacopladas y transacciones atómicas en PostgreSQL.

---

## 🛠️ Stack Tecnológico

* **Runtime:** Node.js (v20+)
* **Framework:** Express 5
* **Lenguaje:** TypeScript 6 (Strict Mode)
* **Base de Datos:** PostgreSQL con driver nativo `pg` (Pool & PoolClient para transacciones)
* **Validación de Esquemas:** Zod (Parseo y tipado estricto de DTOs)
* **Gestor de Paquetes:** pnpm
* **Seguridad:** Helmet, CORS, Express Rate Limit, JWT (`jsonwebtoken`), `bcryptjs`

---

## 🏛️ Arquitectura del Sistema

El proyecto sigue una arquitectura **Vertical Slice** (organizada en `src/features/`), donde cada dominio de negocio está completamente autocontenido en su propia carpeta, con separación estricta de responsabilidades:

```text
backend/src/
├── app.ts                         # Configuración de Express, middlewares y rutas
├── index.ts                       # Entrada del servidor (puerto y arranque)
│
├── config/                        # Configuración tipada
│   └── env.ts                     # Validación de variables de entorno
│
├── infrastructure/                # Conexiones externas e infraestructura
│   ├── postgres.ts                # Pool de conexión a PostgreSQL
│   ├── PostgreSQL.sql             # Esquema DDL oficial de la base de datos
│   └── functions/                 # Funciones SQL auxiliares
│
├── middleWare/                    # Middlewares transversales
│   ├── autorizacionAdmin.middleware.ts
│   ├── errorGlobal.middleware.ts  # Capturador centralizado de AppError y errores 500
│   ├── rateLimit.middleware.ts
│   └── verificarToken.middleware.ts
│
├── routes/                        # Enrutador principal
│   └── index.ts                   # Montaje de prefijos por feature
│
├── shared/                        # Clases y utilidades transversales
│   ├── appError.ts                # Clase AppError (código HTTP + mensaje operacional)
│   └── countItems.ts              # Utilidad de paginación
│
└── features/                      # Dominios de negocio (Vertical Slices)
    ├── auth/                      # Autenticación y credenciales
    ├── inquilino/                 # Casos #1 — #4
    ├── local/                     # Casos #5 — #8
    ├── contrato/                  # Casos #9 — #14
    ├── garantia/                  # Casos #15 — #17
    ├── alquiler/                  # Casos #18 — #20
    └── consumo/                   # Casos #21 — #24
```

### Anatomía Interna de cada Feature (`src/features/[feature]/`)

Cada módulo implementa una separación por capas:

```text
[feature]/
├── controller/
│   └── [feature].controller.ts       # Extrae params/query/body, valida con Zod y envía respuesta HTTP
│
├── interface/
│   ├── dto/                          # Esquemas Zod y tipos inferidos de entrada por caso de uso
│   └── types/                        # Interfaces y contratos de respuesta (B7)
│
├── repository/
│   ├── [feature].repository.ts       # Queries SQL operacionales a PostgreSQL
│   └── rd.repository.ts              # Queries SQL de verificación para Reglas de Dominio
│
├── routes/
│   └── [feature].routes.ts           # Definición de rutas con Express Router
│
└── service/
    ├── [feature].service.ts          # Orquestador del flujo del caso de uso (B8)
    ├── logic/
    │   └── [feature].logic.ts        # Algoritmos, transacciones DB y formateo de respuesta
    └── rule/
        └── rd.ts                     # Validación de Reglas de Dominio (lanza AppError 400/404)
```

---

## 📡 Módulos y Endpoints de la API (24 Casos de Uso)

### 1. Inquilino (`/inquilino`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `POST` | `/inquilino/register` | #1 | Registrar un nuevo inquilino con documento único |
| `GET` | `/inquilino` | #2 | Listar inquilinos con paginación (`page`, `limit`) |
| `GET` | `/inquilino/:id` | #3 | Obtener detalle completo de un inquilino por ID |
| `PATCH` | `/inquilino/:id` | #4 | Actualizar datos de contacto (teléfono, email, estado) |

### 2. Local (`/local`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `POST` | `/local/register` | #5 | Registrar un nuevo local comercial con área y nombre |
| `GET` | `/local` | #6 | Listar locales con paginación (`page`, `limit`) |
| `GET` | `/local/:id` | #7 | Obtener detalle de local por ID |
| `PATCH` | `/local/:id` | #8 | Actualizar información o estado del local |

### 3. Contrato (`/contrato`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `POST` | `/contrato/registrar` | #9 | Crear contrato (genera garantía, primer pago y cuotas) |
| `GET` | `/contrato` | #10 | Listar contratos con paginación (`page`, `limit`) |
| `GET` | `/contrato/:id` | #11 | Obtener detalle del contrato con balance de deudas |
| `PATCH` | `/contrato/:id` | #12 | Actualizar asignación de local u observaciones |
| `PATCH` | `/contrato/:id/cerrar` | #13 | Finalizar/cerrar contrato vigente (valida deudas en 0) |
| `POST` | `/contrato/:id/renovar` | #14 | Renovar contrato extendiendo vigencia |

### 4. Garantía (`/garantia`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `GET` | `/garantia/:contrato_id` | #15 | Consultar estado y saldo disponible de garantía |
| `GET` | `/garantia/:contrato_id/movimientos` | #16 | Listar movimientos de garantía (ingreso, uso, devolución) |
| `POST` | `/garantia/:contrato_id/movimientos/registrar` | #17 | Registrar movimiento sobre el saldo de garantía |

### 5. Alquiler (`/alquiler`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `GET` | `/alquiler/:contrato_id/cuotas` | #18 | Listar cuotas programadas de alquiler con estado y saldo |
| `GET` | `/alquiler/:contrato_id/cuota/:id` | #19 | Consultar detalle de cuota y desglose de pagos aplicados |
| `POST` | `/alquiler/:contrato_id/cuota/:id/pago` | #20 | Registrar pago total o parcial a una cuota de alquiler |

### 6. Consumo de Luz (`/consumo`)
| Método | Endpoint | Caso | Descripción |
|---|---|---|---|
| `POST` | `/consumo/:contrato_id/registrar` | #21 | Registrar lectura mensual de medidor y generar recibo |
| `GET` | `/consumo/:contrato_id` | #22 | Listar lecturas y consumos por contrato con paginación |
| `GET` | `/consumo/:contrato_id/detalle/:id` | #23 | Consultar detalle de consumo, lectura anterior/actual y pagos |
| `POST` | `/consumo/:contrato_id/pagar/:id` | #24 | Registrar pago a un consumo de luz |

### Autenticación (`/auth`)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión y obtener token JWT |

---

## ⚙️ Manejo de Errores y Reglas de Negocio

La aplicación cuenta con un flujo uniforme para el control de errores:
1. **Validación de entrada:** Los esquemas **Zod** en `interface/dto/` validan tipos y restricciones antes de llegar al servicio (retorna error `400` con detalle estructurado).
2. **Reglas de Dominio (RD):** Los servicios invocan la clase `RD` (`service/rule/rd.ts`), la cual valida consistencia mediante consultas optimizadas (`repository/rd.repository.ts`). Si una regla no se cumple, lanza un `AppError` con código HTTP apropiado (`400`, `404`, etc.).
3. **Manejador Global:** El middleware `middleWare/errorGlobal.middleware.ts` intercepta cualquier excepción:
   * Si es `AppError`: responde con el código de estado y mensaje operacional.
   * Si es un error imprevisto: registra el stack trace y responde `500 Internal Server Error` sin filtrar detalles sensibles.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* Node.js >= 20
* PostgreSQL >= 14
* pnpm instalado (`npm install -g pnpm`)

### 1. Clonar e instalar dependencias
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz de `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=rental_management
JWT_SECRET=tu_secreto_super_seguro
```

### 3. Configuración de Base de Datos
Ejecutar el script DDL oficial para crear las tablas y constraints en PostgreSQL:
```bash
psql -U postgres -d rental_management -f src/infrastructure/PostgreSQL.sql
```

### 4. Scripts Disponibles

```bash
# Modo desarrollo con recarga en caliente (tsx watch)
pnpm dev

# Compilar TypeScript a JavaScript (dist/)
pnpm build

# Iniciar servidor en producción desde el código compilado
pnpm start
```
