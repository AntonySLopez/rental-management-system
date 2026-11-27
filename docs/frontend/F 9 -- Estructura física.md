# F9 — Arquitectura Física Frontend

## Estructura Raíz

```text
/frontend
├── src/
│   ├── app/
│   │   ├── core/                              # Servicios singleton, seguridad e infraestructura HTTP
│   │   │   ├── auth/                          # Servicio y estado global de autenticación (token JWT)
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.state.ts              # Signal con usuario actual y estado de sesión
│   │   │   ├── config/                        # Constantes globales y endpoints base
│   │   │   │   └── api.config.ts
│   │   │   ├── guards/                        # Protección y restricción de navegación
│   │   │   │   ├── auth.guard.ts              # Redirige a /login si no hay token
│   │   │   │   └── no-auth.guard.ts           # Redirige a /dashboard si ya está autenticado
│   │   │   └── interceptores/                 # Middlewares HTTP de cliente (HttpClient)
│   │   │       ├── auth.interceptor.ts        # Inyecta Bearer token en headers
│   │   │       └── error.interceptor.ts       # Captura 401 (desconecta), 403, 500 y notifica
│   │   │
│   │   ├── layout/                            # Estructura fija de navegación del sistema
│   │   │   ├── main-layout/                   # Contenedor principal con sidebar y header
│   │   │   │   ├── main-layout.component.ts
│   │   │   │   ├── main-layout.component.html
│   │   │   │   └── main-layout.component.css
│   │   │   ├── header/                        # Barra superior: usuario actual, botón cerrar sesión (L1A)
│   │   │   ├── sidebar/                       # Menú lateral colapsable con accesos a features
│   │   │   └── breadcrumbs/                   # Migas de pan de navegación jerárquica
│   │   │
│   │   ├── shared/                            # Piezas reutilizables comunes a todas las features
│   │   │   ├── componentes/
│   │   │   │   ├── tabla-paginada/            # Wrapper reutilizable de MatTable + MatPaginator
│   │   │   │   ├── estado-vacio/              # Ilustración y mensaje cuando total == 0
│   │   │   │   ├── cargando-spinner/          # Indicador visual durante estado = cargando
│   │   │   │   └── confirm-dialog/            # Diálogo genérico reutilizable (D5)
│   │   │   ├── directivas/                    # Directivas de control de inputs (ej. solo dígitos)
│   │   │   ├── pipes/                         # Formateadores de datos para templates
│   │   │   │   ├── moneda.pipe.ts             # Formato PEN / S/. con 2 decimales
│   │   │   │   └── fecha.pipe.ts              # Formato de fechas amigables
│   │   │   └── modelos/                       # Interfaces transversales comunes
│   │   │       ├── paginacion.model.ts        # Tipos comunes de paginación (page, limit, total)
│   │   │       └── api-error.model.ts         # Modelo estándar de error HTTP
│   │   │
│   │   ├── features/                          # Módulos por dominio del sistema (Vertical Slice)
│   │   │   ├── auth/                          # Autenticación y login (Caso #26)
│   │   │   ├── dashboard/                     # Resumen ejecutivo y contadores (Caso #25)
│   │   │   ├── inquilinos/                    # Gestión de inquilinos (Casos #1 — #4)
│   │   │   ├── locales/                       # Gestión de locales (Casos #5 — #8)
│   │   │   └── contratos/                     # Contratos, garantías, cuotas y luz (Casos #9 — #24)
│   │   │
│   │   ├── app.component.ts                   # Componente raíz con <router-outlet>
│   │   ├── app.config.ts                      # Configuración moderna Standalone (routes, HTTP, M3)
│   │   └── app.routes.ts                      # Enrutador central con Lazy Loading
│   │
│   ├── environments/                          # Variables por entorno de ejecución
│   │   ├── environment.ts                     # URL API local / desarrollo
│   │   └── environment.prod.ts                # URL API producción
│   │
│   ├── styles/                                # Estilos globales y diseño del sistema
│   │   ├── styles.css                         # Reset CSS y estilos utilitarios
│   │   └── theme.css                          # Tema corporativo Angular Material 3
│   │
│   ├── index.html
│   └── main.ts                                # Arranque con bootstrapApplication()
│
├── public/                                    # Recursos estáticos públicos (logos, íconos)
├── angular.json                               # Configuración de compilación y CLI
├── package.json                               # Dependencias del proyecto
└── tsconfig.json                              # Configuración TypeScript
```

---

## Estructura Estándar de una Feature (`features/[feature]/`)

Cada módulo funcional dentro de `src/app/features/` respeta estrictamente una arquitectura estándar dividida en 5 capas:

```text
/features/[nombre-feature]/
├── paginas/                           # Componentes "Smart" asociados a rutas (P#)
│   ├── [feature]-lista/               # Tabla principal con paginador y filtros
│   │   ├── [feature]-lista.component.ts
│   │   ├── [feature]-lista.component.html
│   │   └── [feature]-lista.component.css
│   └── [feature]-detalle/             # Vista individual / ficha técnica completa
│       ├── [feature]-detalle.component.ts
│       ├── [feature]-detalle.component.html
│       └── [feature]-detalle.component.css
│
├── dialogos/                          # Componentes modales contextuales (D# para MatDialog)
│   └── [accion]-dialog/               # Formularios emergentes o visores de comprobante
│       ├── [accion]-dialog.component.ts
│       ├── [accion]-dialog.component.html
│       └── [accion]-dialog.component.css
│
├── componentes/                       # Componentes "Dumb" / Presentacionales incrustados
│   ├── tarjeta-resumen/               # Tarjetas de balances o métricas específicas
│   └── [sub-seccion]-tabla/           # Subtablas locales (ej. cuotas, consumos)
│
├── servicios/                         # Comunicación con la API según B7
│   └── [feature].service.ts           # Métodos HTTP que consumen endpoints EP#
│
├── modelos/                           # Contratos TypeScript de entrada y salida
│   └── [feature].models.ts            # DTOs de entrada y respuestas según B7
│
└── [feature].routes.ts                # Definición de rutas hijas con Lazy Loading
```

---

## Módulos del Sistema y Vistas (F6 / F8 / B7)

| Módulo | Directorio en `features/` | Pantallas (`P#`) | Diálogos (`D#`) | Casos de Uso F8 | Prefijo Ruta |
|---|---|---|---|---|---|
| **Auth** | `features/auth/` | `P0` (Login) | — | **#26** | `/login` |
| **Dashboard** | `features/dashboard/` | `P8` (Dashboard) | — | **#25** | `/dashboard` |
| **Inquilinos** | `features/inquilinos/` | `P1` (Lista)<br>`P2` (Detalle) | `D1` (Formulario Inquilino) | **#1 — #4** | `/inquilinos` |
| **Locales** | `features/locales/` | `P3` (Lista)<br>`P4` (Detalle) | `D2` (Formulario Local) | **#5 — #8** | `/locales` |
| **Contratos** | `features/contratos/` | `P5` (Lista)<br>`P6` (Crear)<br>`P7` (Detalle Central) | `D3` (Editar Contrato)<br>`D4` (Renovar Contrato)<br>`D5` (Confirmar Cierre)<br>`D6` (Movimiento Garantía)<br>`D7` (Detalle Pago Cuota)<br>`D8` (Pagar Cuota)<br>`D9` (Registrar Consumo)<br>`D10` (Detalle Consumo)<br>`D11` (Pagar Consumo) | **#9 — #24** | `/contratos` |

> **Nota Arquitectónica:** Dado que Garantías, Alquiler (Cuotas) y Consumo de Luz pertenecen operativamente al expediente de un contrato, sus pantallas y modales residen cohesionados dentro de `features/contratos/` como pestañas del Hub Central (`P7`), evitando la dispersión de rutas y preservando el contexto del usuario.

---

## Flujo de Interacción Frontend (Reactive Architecture)

```text
Interacción del Usuario (Clic, Submit, Cambio de Página)
  │
  ▼
Componente Smart (P# en paginas/ o D# en dialogos/)
  │  ├─ Valida formulario reactivo tipado (FormGroup / Validators)
  │  ├─ Actualiza estado local: cargando = signal(true)
  │  └─ Invoca al método correspondiente del FeatureService
  ▼
Feature Service (servicios/[feature].service.ts)
  │  ├─ Ensambla parámetros y DTO según B7
  │  └─ Llama a HttpClient (GET, POST, PATCH)
  ▼
HTTP Interceptors (core/interceptores/)
  │  ├─ auth.interceptor: Inyecta Bearer Token en cabeceras
  │  └─ error.interceptor: Captura errores globales (401, 403, 500)
  ▼
Backend API (Express / PostgreSQL)
  │
  ▼
Respuesta HTTP (200, 201 o Error 400)
  │
  ▼
Retorno al Componente Smart (Signals & UI State)
  │  ├─ ok:
  │  │   ├─ Actualiza signal de datos: datos.set(respuesta)
  │  │   ├─ Si es modal: cierra emitiendo id (dialogRef.close)
  │  │   ├─ Notifica éxito al usuario (MatSnackBar)
  │  │   └─ cargando.set(false)
  │  │
  │  └─ err:
  │      ├─ Actualiza signal de error: error.set(err.message)
  │      ├─ Renderiza mensajes de error inline en los campos
  │      └─ cargando.set(false)
  ▼
Renderizado en Template HTML
  └─ @if / @for de Angular renderizan el estado actual de los signals reactivamente
```

---

## Tabla de Responsabilidades por Capa

| Capa / Directorio | Responsabilidad Principal | Reglas y Restricciones |
|---|---|---|
| `core/guards/` | Decide si una ruta puede activarse según el estado de la sesión. | No realiza llamadas HTTP directas; solo consulta a `auth.service`. |
| `core/interceptores/` | Transforma peticiones salientes (headers) y respuestas entrantes (errores globales). | Maneja 401 desconectando la sesión; no modifica la lógica del negocio. |
| `core/auth/` | Gestiona el token JWT en `localStorage` y expone el estado de sesión mediante Signals. | Singleton; accesible desde toda la aplicación. |
| `layout/` | Aloja la estructura fija de la aplicación (menú, cabecera, contenedor dinámico). | No contiene lógica de negocio de ningún feature particular. |
| `shared/componentes/` | Componentes visuales genéricos y agnósticos del dominio (tablas, diálogos de alerta, skeletons). | No consumen servicios de ninguna feature; se comunican solo vía `@Input()` y `@Output()`. |
| `shared/pipes/` | Formatean valores en pantalla (fechas, monedas, estados de texto). | Son funciones puras; no mutan datos ni tienen efectos secundarios. |
| `features/*/paginas/` | Componentes con ruta (`P#`). Coordinan la carga de datos, orquestan signals y abren modales. | Son "Smart Components"; no hacen llamadas `HttpClient` directas (usan su `service`). |
| `features/*/dialogos/` | Componentes modales (`D#`). Capturan formularios compactos y confirman acciones. | Se abren vía `MatDialog`; reciben datos por inyección (`MAT_DIALOG_DATA`) y emiten al cerrar. |
| `features/*/componentes/` | Componentes visuales hijos exclusivos de la feature (tarjetas de resumen, bloques de pestañas). | Son "Dumb Components"; reciben datos del componente padre y emiten eventos. |
| `features/*/servicios/` | Encapsulan las llamadas HTTP a la API REST mapeando estrictamente contra B7. | Retornan observables tipados con las interfaces de `modelos/`; no guardan estado de UI. |
| `features/*/modelos/` | Contiene los tipos e interfaces TypeScript de entrada y salida exactos de B7. | No contiene código ejecutable; solo tipado estricto. |
| `environments/` | Almacena configuraciones dependientes del entorno (URL de la API, modo producción). | No almacena credenciales ni claves secretas. |

---

*Arquitectura basada en Vertical Slicing + Smart/Dumb Components Pattern + Angular Signals Reactivity*


---

## Módulos del Sistema y Vistas (F6 / F8 / B7)

| Módulo | Directorio en `features/` | Pantallas (`P#`) | Diálogos (`D#`) | Casos de Uso F8 | Prefijo Ruta |
|---|---|---|---|---|---|
| **Auth** | `features/auth/` | `P0` (Login) | — | **#26** | `/login` |
| **Dashboard** | `features/dashboard/` | `P8` (Dashboard) | — | **#25** | `/dashboard` |
| **Inquilinos** | `features/inquilinos/` | `P1` (Lista)<br>`P2` (Detalle) | `D1` (Formulario Inquilino) | **#1 — #4** | `/inquilinos` |
| **Locales** | `features/locales/` | `P3` (Lista)<br>`P4` (Detalle) | `D2` (Formulario Local) | **#5 — #8** | `/locales` |
| **Contratos** | `features/contratos/` | `P5` (Lista)<br>`P6` (Crear)<br>`P7` (Detalle Central) | `D3` (Editar Contrato)<br>`D4` (Renovar Contrato)<br>`D5` (Confirmar Cierre)<br>`D6` (Movimiento Garantía)<br>`D7` (Detalle Pago Cuota)<br>`D8` (Pagar Cuota)<br>`D9` (Registrar Consumo)<br>`D10` (Detalle Consumo)<br>`D11` (Pagar Consumo) | **#9 — #24** | `/contratos` |

> **Nota Arquitectónica:** Dado que Garantías, Alquiler (Cuotas) y Consumo de Luz pertenecen operativamente al expediente de un contrato, sus pantallas y modales residen cohesionados dentro de `features/contratos/` como pestañas del Hub Central (`P7`), evitando la dispersión de rutas y preservando el contexto del usuario.

---

## Flujo de Interacción Frontend (Reactive Architecture)

```text
Interacción del Usuario (Clic, Submit, Cambio de Página)
  │
  ▼
Componente Smart (P# en paginas/ o D# en dialogos/)
  │  ├─ Valida formulario reactivo tipado (FormGroup / Validators)
  │  ├─ Actualiza estado local: cargando = signal(true)
  │  └─ Invoca al método correspondiente del FeatureService
  ▼
Feature Service (servicios/[feature].service.ts)
  │  ├─ Ensambla parámetros y DTO según B7
  │  └─ Llama a HttpClient (GET, POST, PATCH)
  ▼
HTTP Interceptors (core/interceptores/)
  │  ├─ auth.interceptor: Inyecta Bearer Token en cabeceras
  │  └─ error.interceptor: Captura errores globales (401, 403, 500)
  ▼
Backend API (Express / PostgreSQL)
  │
  ▼
Respuesta HTTP (200, 201 o Error 400)
  │
  ▼
Retorno al Componente Smart (Signals & UI State)
  │  ├─ ok:
  │  │   ├─ Actualiza signal de datos: datos.set(respuesta)
  │  │   ├─ Si es modal: cierra emitiendo id (dialogRef.close)
  │  │   ├─ Notifica éxito al usuario (MatSnackBar)
  │  │   └─ cargando.set(false)
  │  │
  │  └─ err:
  │      ├─ Actualiza signal de error: error.set(err.message)
  │      ├─ Renderiza mensajes de error inline en los campos
  │      └─ cargando.set(false)
  ▼
Renderizado en Template HTML
  └─ @if / @for de Angular renderizan el estado actual de los signals reactivamente
```

---

## Tabla de Responsabilidades por Capa

| Capa / Directorio | Responsabilidad Principal | Reglas y Restricciones |
|---|---|---|
| `core/guards/` | Decide si una ruta puede activarse según el estado de la sesión. | No realiza llamadas HTTP directas; solo consulta a `auth.service`. |
| `core/interceptores/` | Transforma peticiones salientes (headers) y respuestas entrantes (errores globales). | Maneja 401 desconectando la sesión; no modifica la lógica del negocio. |
| `core/auth/` | Gestiona el token JWT en `localStorage` y expone el estado de sesión mediante Signals. | Singleton; accesible desde toda la aplicación. |
| `layout/` | Aloja la estructura fija de la aplicación (menú, cabecera, contenedor dinámico). | No contiene lógica de negocio de ningún feature particular. |
| `shared/componentes/` | Componentes visuales genéricos y agnósticos del dominio (tablas, diálogos de alerta, skeletons). | No consumen servicios de ninguna feature; se comunican solo vía `@Input()` y `@Output()`. |
| `shared/pipes/` | Formatean valores en pantalla (fechas, monedas, estados de texto). | Son funciones puras; no mutan datos ni tienen efectos secundarios. |
| `features/*/paginas/` | Componentes con ruta (`P#`). Coordinan la carga de datos, orquestan signals y abren modales. | Son "Smart Components"; no hacen llamadas `HttpClient` directas (usan su `service`). |
| `features/*/dialogos/` | Componentes modales (`D#`). Capturan formularios compactos y confirman acciones. | Se abren vía `MatDialog`; reciben datos por inyección (`MAT_DIALOG_DATA`) y emiten al cerrar. |
| `features/*/componentes/` | Componentes visuales hijos exclusivos de la feature (tarjetas de resumen, bloques de pestañas). | Son "Dumb Components"; reciben datos del componente padre y emiten eventos. |
| `features/*/servicios/` | Encapsulan las llamadas HTTP a la API REST mapeando estrictamente contra B7. | Retornan observables tipados con las interfaces de `modelos/`; no guardan estado de UI. |
| `features/*/modelos/` | Contiene los tipos e interfaces TypeScript de entrada y salida exactos de B7. | No contiene código ejecutable; solo tipado estricto. |
| `environments/` | Almacena configuraciones dependientes del entorno (URL de la API, modo producción). | No almacena credenciales ni claves secretas. |

---

*Arquitectura basada en Vertical Slicing + Smart/Dumb Components Pattern + Angular Signals Reactivity*