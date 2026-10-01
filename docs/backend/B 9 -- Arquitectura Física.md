
## Estructura raíz

```
/src
  app.ts
  index.ts

  /modules
    /[dominio]     ← sigue leyenda de módulos

  /infrastructure
    db.ts
    logger.ts

  /config
    env.ts
    env.schema.ts

  /middlewares
    auth.ts
    errorHandler.ts

.env
.env.example
.gitignore
package.json
tsconfig.json
```

---

## Leyenda de módulos

Cada dominio dentro de `/modules` sigue esta estructura:

```
/[dominio]
  /interface
    /dto
    /types
  /routes
  /controller
  /service
    /rulesDomain
    /logic
  /repository
    /mappers
```

---

## Flujo de request

```
Request
  → Routes         (define endpoints + conecta al controller)
  → Controller     (valida forma del DTO + delega)
  → Service        (orquesta + llama a rulesDomain)
    → RulesDomain  (valida reglas de negocio)
    → Logic        (ejecuta lógica concreta)
  → Repository     (query a DB)
    → Mappers      (transforma entrada/salida de DB)
  ← Response

* /interface  (transversal — dto y types disponibles para todo el módulo)
```

---

## Responsabilidades

| Capa | Responsabilidad |
|---|---|
| `routes` | Define endpoints y conecta al controller |
| `controller` | Valida forma del DTO y delega al service |
| `service` | Orquesta el flujo y llama a rulesDomain |
| `rulesDomain` | Valida reglas de negocio |
| `logic` | Ejecuta la lógica concreta del caso de uso |
| `repository` | Único punto de contacto con la DB |
| `mappers` | Transforma datos entre DB y dominio |
| `interface/dto` | Schemas de validación de entrada/salida |
| `interface/types` | Tipos e interfaces TypeScript del módulo |
| `infrastructure` | Singletons y configuración global |
| `config` | Lee y valida variables de entorno |
| `middlewares` | Lógica transversal (auth, errores, logs) |

---

*Inspirado en Clean Architecture + Layered Architecture*
