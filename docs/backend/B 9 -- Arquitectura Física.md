# B9 — Arquitectura Física

## Estructura Raíz

```text
/backend
├── src/
│   ├── app.ts                         # Configuración de Express, middlewares y rutas
│   ├── index.ts                       # Punto de entrada del servidor (puerto y arranque)
│   │
│   ├── config/                        # Variables de entorno y configuración
│   │   └── env.ts
│   │
│   ├── infrastructure/                # Conexiones externas y base de datos
│   │   ├── postgres.ts                # Pool de conexión a PostgreSQL
│   │   ├── PostgreSQL.sql             # Esquema DDL y constraints de la BD
│   │   └── functions/                 # Scripts o funciones auxiliares de BD
│   │
│   ├── middleWare/                    # Middlewares transversales de Express
│   │   ├── autorizacionAdmin.middleware.ts
│   │   ├── errorGlobal.middleware.ts  # Manejo centralizado de AppError y errores no controlados
│   │   ├── rateLimit.middleware.ts
│   │   └── verificarToken.middleware.ts
│   │
│   ├── routes/                        # Enrutador central de la aplicación
│   │   └── index.ts                   # Montaje de rutas de todas las features
│   │
│   ├── shared/                        # Clases y utilidades compartidas
│   │   ├── appError.ts                # Error personalizado de aplicación (código HTTP y mensaje)
│   │   └── countItems.ts
│   │
│   └── features/                      # Módulos por dominio del sistema (Vertical Slice / Feature Folders)
│       ├── RfInquilino/               # Gestión de inquilinos (Casos #1 — #4)
│       ├── RfLocal/                   # Gestión de locales (Casos #5 — #8)
│       ├── Rfcontrato/                # Gestión de contratos (Casos #9 — #14)
│       ├── RfGarantia/                # Gestión de garantías y movimientos (Casos #15 — #17)
│       ├── RfAlquiler/                # Cuotas y pagos de alquiler (Casos #18 — #20)
│       └── RfConsumo/                 # Consumo de servicios y pagos (Casos #21 — #24)
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Estructura Estándar de Feature (`features/Rf*`)

Cada módulo o feature dentro de `/src/features` sigue una arquitectura estandarizada por capas de responsabilidad:

```text
/Rf[Feature]
├── controller/
│   └── [feature].controller.ts        # Recibe request, valida DTO con Zod, delega al service y responde HTTP
│
├── interface/
│   ├── dto/                           # Esquemas Zod y tipos de entrada/salida de cada caso de uso
│   │   ├── [casoDeUso1].dto.ts
│   │   └── [casoDeUso2].dto.ts
│   └── types/
│       └── [feature].types.ts         # Interfaces TypeScript y contratos de respuesta (B7)
│
├── repository/
│   ├── [feature].repository.ts        # Consultas SQL a PostgreSQL para entidades del dominio
│   └── rd.repository.ts               # Consultas SQL específicas para verificar Reglas de Dominio (RD)
│
├── routes/
│   └── [feature].routes.ts            # Definición de rutas con Express Router y enlace al controller
│
└── service/
    ├── [feature].service.ts           # Orquestador del flujo según B8 (ejecuta RD y delega a Logic)
    ├── logic/
    │   └── [feature].logic.ts         # Lógica concreta del caso de uso (cálculos, transacciones DB)
    └── rule/
        └── rd.ts                      # Clase RD: valida reglas de negocio y lanza AppError (400/404)
```

---

## Módulos del Sistema y Casos de Uso (B7 / B8)

| Módulo | Directorio | Casos de Uso Cubiertos | Prefijo de Ruta Base |
|---|---|---|---|
| **Inquilino** | `src/features/RfInquilino` | **#1 — #4** (Registro, listado, detalle, actualización) | `/inquilino` |
| **Local** | `src/features/RfLocal` | **#5 — #8** (Registro, listado, detalle, actualización) | `/local` |
| **Contrato** | `src/features/Rfcontrato` | **#9 — #14** (Creación, listado, detalle, actualización, cierre, renovación) | `/contrato` |
| **Garantía** | `src/features/RfGarantia` | **#15 — #17** (Detalle garantía, listado movimientos, registro movimiento) | `/garantia` |
| **Alquiler** | `src/features/RfAlquiler` | **#18 — #20** (Listar cuotas, detalle cuota, registrar pago de alquiler) | `/alquiler` |
| **Consumo** | `src/features/RfConsumo` | **#21 — #24** (Registrar consumo, listar consumos, detalle consumo, registrar pago) | `/consumo` |

---

## Flujo de Request

```text
Request HTTP
  │
  ▼
Routes (express.Router)
  │  └─ Enruta según método y path al Controller
  ▼
Controller
  │  └─ Valida params, query y body usando el schema Zod de interface/dto
  │  └─ Delega ejecución al Service
  ▼
Service (Orquestador B8)
  │
  ├──► Rule / RD (Reglas de Dominio)
  │      └─ Ejecuta validaciones de negocio previas
  │      └─ Consulta condiciones mediante repository/rd.repository.ts
  │      └─ Si una regla no se cumple: lanza AppError (400 / 404)
  │
  └──► Logic (Lógica de Operación)
         └─ Ejecuta la operación concreta según B8 (operationX)
         └─ Maneja transacciones si aplica (BEGIN / COMMIT / ROLLBACK)
         └─ Ejecuta queries operacionales mediante repository/[feature].repository.ts
         └─ Formatea el resultado según los contratos B7
  │
  ▼
Response HTTP
  └─ Controller retorna código de estado (200 / 201) con el JSON resultante
```

---

## Tabla de Responsabilidades

| Capa / Directorio | Responsabilidad Principal |
|---|---|
| `routes/` | Define endpoints HTTP mediante `Router()` y los asocia a los métodos del controlador. |
| `controller/` | Extrae y valida datos de la petición (params, query, body) con esquemas Zod (`parse`); maneja el código de estado HTTP y envía la respuesta. |
| `service/` | Orquesta la secuencia de pasos especificada en B8: invoca las Reglas de Dominio en orden y luego llama a la lógica de operación correspondiente. |
| `service/rule/ (RD)` | Encapsula las Reglas de Dominio del caso de uso. Verifica estados, existencias y consistencias; arroja `AppError` si alguna regla falla. |
| `service/logic/` | Contiene los cálculos matemáticos, formateo de datos, coordinación de transacciones (`poolClient`) y llamadas al repositorio de la entidad. |
| `repository/[feature]` | Contiene las queries SQL (`INSERT`, `SELECT`, `UPDATE`, etc.) para manipular las tablas principales del dominio. |
| `repository/rd.repository` | Contiene exclusivamente queries SQL de verificación rápida (`SELECT id ...`) para sustentar las validaciones de las Reglas de Dominio. |
| `interface/dto/` | Define los esquemas de validación Zod y exporta los tipos inferidos para las entradas de cada caso de uso. |
| `interface/types/` | Define los contratos TypeScript de entrada/salida y las estructuras de datos de respuesta estipuladas en B7. |
| `infrastructure/` | Centraliza conexiones de infraestructura externa (PostgreSQL pool) y definiciones de esquema SQL. |
| `middleWare/` | Provee middlewares globales para autenticación, autorización, limitación de tasa y captura centralizada de errores (`errorGlobal.middleware.ts`). |
| `config/` | Carga y tipifica las variables de entorno (`env.ts`). |
| `shared/` | Almacena clases comunes como `AppError` que unifican el control de errores de la aplicación. |

---

*Inspirado en Clean Architecture + Feature-Sliced Architecture + Layered Architecture*
