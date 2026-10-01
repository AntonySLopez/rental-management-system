
# (Rental v2)

Define lo que el sistema debe tener más allá de los casos de uso base. Solo entra lo que el proyecto necesita.

---

## Seguridad

| Elemento | Necesidad que lo exige | Ubicación (F9) | Estado |
|---|---|---|---|
| Pantalla de login [P26] | El sistema tendrá login (rol admin) | features/auth/ | Entra |
| Guard de rutas | Todo el sistema exige sesión | core/guards/ | Entra |
| Interceptor de token | El backend exige credencial en cada llamada | core/interceptores/ | Entra |
| Manejo de sesión | Guardar, consultar y cerrar la sesión | core/sesion/ | Entra |
| Expiración de sesión | Si el backend responde "no autorizado" → cierra sesión y va al login | core/interceptores/ | Entra |
| Persistencia local | Guardar solo el token de sesión | core/sesion/ | Entra |
| Guard por rol | Solo existe el rol admin | core/guards/ | Fuera por ahora |

---

## Fiabilidad

| Elemento | Necesidad que lo exige | Ubicación (F9) | Estado |
|---|---|---|---|
| Interceptor de errores | Las funciones de F8 terminan en "err → muestra mensaje" | core/interceptores/ | Entra |

---

## Usabilidad

| Elemento | Necesidad que lo exige | Ubicación (F9) | Estado |
|---|---|---|---|
| Indicador de carga | "estado = cargando" en casi todas las pantallas | shared/componentes/ | Entra |
| Diálogo de confirmación | Cerrar y renovar contrato (P11) | shared/componentes/ | Entra |
| Formularios reactivos con validación | "validar formulario → errores de campo" en F8 | componentes de formulario de cada feature | Entra |

---

## Mantenibilidad

| Elemento | Necesidad que lo exige | Ubicación (F9) | Estado |
|---|---|---|---|
| Variables por entorno | La URL de la API no va fija en el código | environments/ | Entra |
| Pipes de formato | Fechas y montos (precio mensual, deuda, pagos) | shared/pipes/ | Entra |

---

## Librerías y dependencias

| Librería | Uso | Ubicación |
|---|---|---|
| Angular Material (tema Material Design 3) | Tablas, diálogos, selectores, formularios, navegación | Dependencia del proyecto, tema en estilos globales. Los features la usan a través de shared/componentes/ |

---

## Fuera por ahora

| Elemento | Motivo |
|---|---|
| Cache | Las pantallas recargan tras cada cambio y no hay un problema de rendimiento que lo justifique |
| Guard por rol | Solo existe el rol admin |
| Persistencia local de datos de negocio | Ninguna función de F8 la necesita |
| Seguridad de transporte (HTTPS, CORS) | Es responsabilidad del backend y del despliegue (F11) |

---

## Impactos en fases anteriores

- **A5 / F6 / F8:** nueva pantalla P26 (login), número siguiente al último de A5, con su caso de uso (iniciar sesión, cerrar sesión)
- **B7:** endpoints de autenticación que hoy no existen
- **F9:** se agrega features/auth/ y la carpeta environments/