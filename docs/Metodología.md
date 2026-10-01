---

# Resumen General

```text
                 Nivel 0
              Fundamentos
                    │
                    ▼
             Nivel 1 Análisis
             A1 Problema
             A2 Entidades
             A3 Actores y permisos
             A4 Casos de uso
             A5 Responsabilidades por caso de uso
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
     Backend                Frontend

B6  Flujo abstracto      F6  Flujo abstracto
B7  Contratos            F7  Contratos
B8  Flujo detallado      F8  Flujo lógico
B9  Arquitectura         F9  Arquitectura
B10 Robustez             F10 Robustez
B11 Despliegue           F11 Despliegue
```

---

# Nivel 0 — Fundamentos

## Objetivo

Comprender cómo se organiza cualquier aplicación.

No importa si se desarrolla un backend, un frontend o una aplicación móvil.

Toda aplicación puede entenderse mediante tres grandes responsabilidades.

```text
Interacción

↓

Aplicación

↓

Infraestructura
```

## Interacción

Es la responsable de comunicarse con quien utiliza el sistema.

Ejemplos:

- Usuario
- HTTP
- CLI
- Eventos

Su función es recibir solicitudes.

---

## Aplicación

Es quien decide qué hacer.

Aquí viven:

- Casos de uso
- Coordinación
- Validaciones
- Reglas del proceso

No conoce detalles tecnológicos.

---

## Infraestructura

Es quien se comunica con el exterior.

Ejemplos:

- Base de datos
- API REST
- LocalStorage
- WebSocket
- Sistema de archivos

No decide cuándo hacer algo.

Solo proporciona los mecanismos necesarios.

---

# Nivel 1 — Dominio

Todo proyecto comienza comprendiendo el problema.

Este análisis será compartido tanto por el backend como por el frontend.

---

## A1 — Comprender el problema

### Pregunta

> ¿Qué problema intenta resolver el sistema?

Resultado esperado:

Comprender el negocio.

No existe código.

No existen pantallas.

---

## A2 — Definir entidades

### Pregunta

> ¿Qué elementos existen dentro del dominio?

Resultado esperado:

Modelo conceptual del sistema.

Ejemplos:

- Usuario
- Producto
- Contrato
- Pago

---

## A3 — Actores y permisos

### Pregunta

> ¿Quién interactúa con el sistema y qué puede hacer?

Resultado esperado:

Límites claros de cada actor dentro del dominio.

Ejemplos de actores:

- Administrador
- Vendedor
- Cliente
- Sistema

Para cada actor se define qué operaciones puede realizar sobre cada entidad y cuáles están fuera de su alcance.

---

## A4 — Casos de uso por actor

### Pregunta

> ¿Quién tiene acceso a cada caso de uso?

Resultado esperado:

Tabla de casos de uso con los actores que tienen acceso a cada uno.

| Caso de uso | Administrador | Vendedor | Cliente | Sistema |
|-------------|:---:|:---:|:---:|:---:|
| Registrar venta | ✅ | ✅ | ❌ | ❌ |
| Consultar lista de ventas | ✅ | ✅ | ❌ | ❌ |
| ... | | | | |

---

## A5 — Responsabilidades por caso de uso

### Pregunta
> ¿Qué necesita cada sector para resolver cada caso de uso?

### Resultado esperado

Por cada caso de uso se define qué pantallas intervienen,
qué consume el frontend y qué expone el backend.

### Formato frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|

- **#** — número de pantalla. Si la pantalla ya fue definida en otro caso de uso se reutiliza su número sin redefinirla.
- **Consume** — número de endpoint de la tabla backend que esta pantalla necesita para cargar.
- **Envía a** — número de endpoint al que esta pantalla envía datos.
- **Finaliza** — qué hace la pantalla al terminar el caso de uso.

### Formato backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|

- **#** — número de endpoint. Si el endpoint ya fue definido en otro caso de uso solo se referencia su número, no se redefine.
- **Retorna** — `Datos` si retorna un objeto o lista. `Booleano` si solo confirma éxito o fallo.

### Criterios

- Las listas retornan solo los campos que se muestran en pantalla más paginado.
- El detalle retorna todos los campos de la entidad más datos enriquecidos si la pantalla los necesita siempre.
- Los endpoints nunca asumen que la llamada viene del frontend — siempre validan existencia del recurso.
- Nunca se usa SELECT * — siempre se seleccionan solo los campos necesarios.

A partir de este punto el proceso se divide.

---

# Rama Backend

El backend transforma los casos de uso en una API.

---

## B6 — Flujo Abstracto del Caso de Uso

### Pregunta

> ¿Cómo funciona el proceso a grandes rasgos?

Todavía no existe código.

Solo existe la lógica general.

Resultado expresado como pseudocódigo:

```
registrarVenta {
  validarCliente { ... }
  validarProductos { ... }
  calcularTotal { ... }
  registrarDetalle { ... }
  actualizarStock { ... }
}
```

---


---

## B7 — Contratos

### Pregunta

> ¿Cómo se comunica el backend con el exterior?

Resultado esperado:

Por cada endpoint definido en A5 se documenta:

- Reglas de dominio — solo lo que el schema no puede detectar.
- Contrato de entrada — interface TypeScript del DTO que recibe el backend.
- Contrato de salida — interface TypeScript de la respuesta que retorna.

### Criterio de reglas de dominio

Las validaciones de formato, campos vacíos o tipos de dato las maneja el schema del DTO.
Las reglas de dominio solo incluyen validaciones que requieren consultar la base de datos
o evaluar lógica de negocio que el schema no puede resolver.

Ejemplo:
```ts
// Entrada
interface AgregarProveedorDto {
  nombre: string;
  documento: string;
  telefono?: string;
}

// Salida
interface AgregarProveedorResponse {
  success: boolean;
  message: string;
}
```

---
## B8 — Flujo Detallado

### Pregunta

> ¿Cómo se implementa completamente cada caso de uso?

Aquí se detallan:

- Validaciones
- Reglas
- Lógica
- Coordinación

Resultado:

Caso de uso completamente definido.

---

## B9 — Arquitectura Física

### Pregunta

> ¿Cómo se organizará el proyecto?

Aquí aparecen:

- Carpetas
- Framework
- Organización del código

Resultado:

Estructura física del backend.

---

## B10 — Infraestructura Complementaria

### Pregunta

> ¿Qué necesita el sistema para ser robusto?

Aquí aparecen únicamente cuando son necesarios:

- Seguridad
- Middlewares
- JWT
- Logs
- Cache
- Rate Limit
- Auditoría

No forman parte del código base.

Se incorporan cuando el proyecto los necesita.

---

## B11 — Despliegue

### Pregunta

> ¿Cómo se pondrá en producción?

Ejemplos:

- Docker
- VPS
- Cloud
- Costos
- Monitoreo

---


# Rama Frontend

El frontend transforma los casos de uso en una experiencia para el usuario.

---

## F6 — Flujo Abstracto de Pantallas

### Pregunta
> ¿Cómo navega el usuario a través de las pantallas?

### Contexto
No existe código. Solo el recorrido de navegación por caso de uso y la intención de la pantalla responsable.

### Resultado
Por cada caso de uso:
- Recorrido desde el padre hasta el componente responsable de la acción, identificando pantallas nuevas, jerarquía y disparadores
- Funciones abstractas de la pantalla responsable

### Formato

```
/ruta          [P#]  // disparador
  --> /ruta    [P#]  // disparador → EP#

P# — Nombre de la pantalla responsable
{
  funcion()    // disparador → EP#
  → ok: resultado
  → err: resultado
}
```

### Criterios
- Cada caso de uso tiene su propio recorrido
- Los números de pantalla son los definidos en A5
- Las pantallas nuevas que A5 no registró reciben el número siguiente al último de A5
- El disparador indica cómo el usuario inicia el salto — btn, click, submit, automático
- Las acciones que no navegan (cerrar, renovar) se documentan en la pantalla donde ocurren con su EP y resultado
- Los retornos automáticos después de una acción se documentan como último paso del recorrido
- Solo la pantalla responsable lleva funciones; las pantallas de paso solo aparecen en el recorrido
- Una función ya definida en un caso anterior no se repite; solo se agregan las pantallas o funciones nuevas necesarias para completar el caso

---

## F7 — Contratos de Pantalla

### Pregunta
> ¿Qué necesita cada pantalla del backend?

### Contexto
No existe documento propio. El contrato entre pantalla y API ya está definido en B7.

### Resultado
B7 es la referencia compartida: lo que el frontend envía (request) y lo que recibe (response) de cada endpoint.

---

## F8 — Flujo Lógico

### Pregunta
> ¿Qué hace la aplicación cuando el usuario interactúa?

### Contexto
Todavía no existe Angular. Solo existe la lógica. F6 enuncia las funciones y F8 las desarrolla.

### Resultado
Por cada caso de uso, el cuerpo de cada función por pantalla:
- Funciones con intención
- Estados (cargando, con datos, error)
- Llamadas a endpoints
- Validaciones
- Coordinación entre pantallas

### Criterios
- Se organiza por caso de uso, siguiendo el flujo de F6
- La primera vez que aparece una función se desglosa completa
- En los casos siguientes solo se referencia el caso donde ya fue definida

---

## F9 — Arquitectura Física

### Pregunta
> ¿Cómo organizaremos el proyecto?

### Contexto
Aquí aparecen:
- Framework
- Carpetas
- Componentes
- Servicios
- Organización física

### Resultado
Proyecto listo para implementarse, definido en dos tramos:
- Estructura de un feature (uno por sector del negocio): paginas/ (componentes con ruta, P#), componentes/ (piezas reutilizables del feature), servicios/, modelos/ y rutas propias
- Estructura del proyecto: core/ (transversal), shared/ (reutilizable), layout/ (marco fijo), features/, rutas globales y archivos base del framework

### Criterios
- Las dependencias van en un solo sentido: features → shared → core
- Los features no se importan entre sí
- Todo elemento nuevo se ubica por alcance: una página, un feature o todo el sistema

---

## F10 — Infraestructura Complementaria

### Pregunta
> ¿Qué necesita el frontend para ser robusto?

### Contexto
Define lo que el sistema debe tener más allá de los casos de uso base. Solo entra lo que el proyecto necesita.

### Resultado
- Por cada atributo de calidad (seguridad, fiabilidad, usabilidad, mantenibilidad): los elementos necesarios, con la necesidad que los exige (F6/F8/B7), su ubicación en la estructura de F9 y su estado (entra / fuera por ahora)
- Librerías y dependencias elegidas
- Lo que queda fuera por ahora, con su motivo
- Impactos en fases anteriores (nuevas pantallas en F6/F8, nuevos endpoints en B7)

Ejemplos:
- Guards
- Interceptores
- Manejo de sesión
- Persistencia local
- Cache
- Librería de UI

---

## F11 — Despliegue

### Pregunta
> ¿Cómo publicaremos la aplicación?

Ejemplos:

- Build
- Hosting
- CDN
- Costos
- Optimización

---

# Principios de la Metodología

- Cada fase responde una única pregunta.
- No se implementa una solución antes de comprender el problema.
- La arquitectura evoluciona junto con el proyecto.
- Las tecnologías son herramientas, no el objetivo.
- Los conceptos aparecen cuando el proyecto los necesita.
- El objetivo principal es mantener un flujo de desarrollo claro y continuo, evitando bloqueos durante la construcción del sistema.

---

# Objetivo Final

Al finalizar el proceso, el desarrollador habrá recorrido un camino completo:

```text
Problema

↓

Análisis
A1 → A2 → A3 → A4 → A5

↓

Backend y Frontend
B6-B11 / F6-F11

↓

Implementación

↓

Robustez

↓

Producción
```

Cada etapa existe porque responde a una necesidad concreta del desarrollo.

No se estudian conceptos por adelantado; se incorporan cuando ayudan a resolver un problema real.