
# Inquilino

---

## Caso de uso: Registrar inquilino

## Frontend

| #   | Pantalla                       | Consume | Acción con respuesta | Envía a | Finaliza                        |
| --- | ------------------------------ | ------- | -------------------- | ------- | ------------------------------- |
| 1   | Formulario registrar inquilino | —       | Envío de formulario  | 1       | Redirige a detalle de inquilino |

## Backend

| #   | Endpoint                 | Responsabilidad           | Retorna |
| --- | ------------------------ | ------------------------- | ------- |
| 1   | `POST /inquilinos/nuevo` | Registrar nuevo inquilino | Datos   |

---

## Caso de uso: Listar inquilinos

## Frontend

| #   | Pantalla            | Consume | Acción con respuesta | Envía a | Finaliza               |
| --- | ------------------- | ------- | -------------------- | ------- | ---------------------- |
| 2   | Lista de inquilinos | 2       | Carga de pantalla    | —       | Muestra lista paginada |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 2 | `GET /inquilinos` | Listar inquilinos con paginación | Datos |

---

## Caso de uso: Ver detalle de inquilino

## Frontend

| #   | Pantalla             | Consume | Acción con respuesta   | Envía a | Finaliza                               |
| --- | -------------------- | ------- | ---------------------- | ------- | -------------------------------------- |
|     | Lista de inquilinos  | 2       | Selección de inquilino | —       | Navega a detalle                       |
| 3   | Detalle de inquilino | 3       | Carga de pantalla      | —       | Muestra todos los campos del inquilino |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 3 | `GET /inquilinos/:id` | Obtener inquilino por id | Datos |

---

## Caso de uso: Actualizar inquilino

## Frontend

| #   | Pantalla                    | Consume | Acción con respuesta          | Envía a | Finaliza                        |
| --- | --------------------------- | ------- | ----------------------------- | ------- | ------------------------------- |
| —   | Lista de inquilinos         | 2       | Selección de inquilino        | —       | Navega a detalle                |
| 3   | Detalle de inquilino        | 3       | Selección de editar           | —       | Navega a formulario editar      |
| 4   | Formulario editar inquilino | 3       | Carga de formulario con datos | 4       | Redirige a detalle de inquilino |

## Backend

| #   | Endpoint              | Responsabilidad             | Retorna |
| --- | --------------------- | --------------------------- | ------- |
| 4   | `PUT /inquilinos/:id` | Actualizar inquilino por id | Datos   |

---
---

# Local

---

## Caso de uso: Registrar local

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 5 | Formulario registrar local | — | Envío de formulario | 5 | Redirige a detalle de local |

## Backend

| #   | Endpoint        | Responsabilidad       | Retorna |
| --- | --------------- | --------------------- | ------- |
| 5   | `POST /locales` | Registrar nuevo local | Datos   |

---

## Caso de uso: Listar locales

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 6 | Lista de locales | 6 | Carga de pantalla | — | Muestra lista paginada |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 6 | `GET /locales` | Listar locales con paginación | Datos |

---

## Caso de uso: Ver detalle de local

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 6 | Lista de locales | 6 | Selección de local | — | Navega a detalle |
| 7 | Detalle de local | 7 | Carga de pantalla | — | Muestra todos los campos del local |

## Backend

| #   | Endpoint           | Responsabilidad          | Retorna |
| --- | ------------------ | ------------------------ | ------- |
| 7   | `GET /locales/:id` | Obtener detalle de local | Datos   |

---

## Caso de uso: Actualizar local

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 6 | Lista de locales | 6 | Selección de local | — | Navega a detalle |
| 7 | Detalle de local | 7 | Selección de editar | — | Navega a formulario editar |
| 8 | Formulario editar local | 7 | Carga de formulario con datos | 8 | Redirige a detalle de local |

### Backend

| #   | Endpoint           | Responsabilidad         | Retorna |
| --- | ------------------ | ----------------------- | ------- |
| 8   | `PUT /locales/:id` | Actualizar local por id | Datos   |

---
---

# Contrato

---

## Caso de uso: Crear contrato

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 9 | Formulario crear contrato | 2, 6 | Carga de formulario | 9 | Redirige a detalle de contrato |

## Backend

| #   | Endpoint                            | Responsabilidad                                              | Retorna |
| --- | ----------------------------------- | ------------------------------------------------------------ | ------- |
| 9   | `POST /contratos`                   | Crear contrato, generar garantía y primera cuota de alquiler | Datos   |

---

## Caso de uso: Listar contratos

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 10 | Lista de contratos | 10 | Carga de pantalla | — | Muestra lista paginada |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 10 | `GET /contratos` | Listar contratos con paginación | Datos |

---

## Caso de uso: Ver detalle de contrato

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 10 | Lista de contratos | 10 | Selección de contrato | — | Navega a detalle |
| 11 | Detalle de contrato | 11 | Carga de pantalla | — | Muestra todos los campos del contrato |

## Backend

| #   | Endpoint             | Responsabilidad              | Retorna |
| --- | -------------------- | ---------------------------- | ------- |
| 11  | `GET /contratos/:id` | Obtener detalles de contrato | Datos   |


---

## Caso de uso: Actualizar contrato

## Frontend

| #   | Pantalla                   | Consume | Acción con respuesta          | Envía a | Finaliza                       |
| --- | -------------------------- | ------- | ----------------------------- | ------- | ------------------------------ |
| 10  | Lista de contratos         | 10      | Selección de contrato         | —       | Navega a detalle               |
| 11  | Detalle de contrato        | 11      | Selección de editar           | —       | Navega a formulario editar     |
| 12  | Formulario editar contrato | 11      | Carga de formulario con datos | 12      | Redirige a detalle de contrato |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 12 | `PUT /contratos/:id` | Actualizar contrato por id | Datos |

---

## Caso de uso: Cerrar contrato

## Frontend

| #   | Pantalla            | Consume | Acción con respuesta         | Envía a | Finaliza                                |
| --- | ------------------- | ------- | ---------------------------- | ------- | --------------------------------------- |
| 11  | Detalle de contrato | 11      | Selección de cerrar contrato | 13      | Actualiza estado del contrato a cerrado |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 13 | `PATCH /contratos/:id/cerrar` | Cerrar contrato por id | Booleano |

---

## Caso de uso: Renovar contrato

## Frontend

| #   | Pantalla            | Consume | Acción con respuesta          | Envía a | Finaliza                       |
| --- | ------------------- | ------- | ----------------------------- | ------- | ------------------------------ |
| 11  | Detalle de contrato | 11      | Selección de renovar contrato | 14      | Redirige a detalle de contrato |

## Backend

| #   | Endpoint                       | Responsabilidad                               | Retorna  |
| --- | ------------------------------ | --------------------------------------------- | -------- |
| 14  | `PATCH /contratos/:id/renovar` | Renovar contrato actualizando fechas y estado | Booleano |

---
---

# Garantia


---

## Caso de uso: Ver detalle de garantía

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 11 | Detalle de contrato | 11 | Selección de garantía | — | Navega a detalle de garantía |
| 15 | Detalle de garantía | 15 | Carga de pantalla | — | Muestra todos los campos de la garantía |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 15 | `GET /garantias/:contrato_id` | Obtener garantía por contrato | Datos |

---

## Caso de uso: Listar movimientos de garantía

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 15 | Detalle de garantía | 15 | Carga de pantalla | — | Muestra lista de movimientos |
| 16 | Lista de movimientos de garantía | 16 | Carga de pantalla | — | Muestra lista paginada |

## Backend

| #   | Endpoint                                  | Responsabilidad                             | Retorna |
| --- | ----------------------------------------- | ------------------------------------------- | ------- |
| 16  | `GET /garantias/:contrato_id/movimientos` | Listar movimientos de garantía por contrato | Datos   |


---

## Caso de uso: Registrar movimiento de garantía

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 15 | Detalle de garantía | 15 | Selección de registrar movimiento | — | Navega a formulario |
| 17 | Formulario registrar movimiento de garantía | — | Envío de formulario | 17 | Redirige a detalle de garantía |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 17 | `POST /garantias/:contrato_id/movimientos` | Registrar movimiento de garantía | Datos |


---
---

# Alquiler


---

## Caso de uso: Listar cuotas de alquiler

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 11 | Detalle de contrato | 11 | Selección de cuotas | — | Navega a lista de cuotas |
| 18 | Lista de cuotas de alquiler | 18 | Carga de pantalla | — | Muestra lista paginada |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 18 | `GET /contratos/:contrato_id/cuotas` | Listar cuotas de alquiler por contrato | Datos |

---

## Caso de uso: Ver detalle de cuota

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 18 | Lista de cuotas de alquiler | 18 | Selección de cuota | — | Navega a detalle |
| 19 | Detalle de cuota | 19 | Carga de pantalla | — | Muestra todos los campos de la cuota |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 19 | `GET /contratos/:contrato_id/cuotas/:id` | Obtener cuota por id | Datos |

---

## Caso de uso: Registrar pago de alquiler

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 19 | Detalle de cuota | 19 | Selección de registrar pago | — | Navega a formulario |
| 20 | Formulario registrar pago de alquiler | — | Envío de formulario | 20 | Redirige a detalle de cuota |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 20 | `POST /contratos/:contrato_id/cuotas/:id/pagos` | Registrar pago de alquiler | Datos |

---
---

# Consumo de luz

---

## Caso de uso: Registrar consumo de luz

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 11 | Detalle de contrato | 11 | Selección de consumos | — | Navega a lista de consumos |
| 21 | Formulario registrar consumo de luz | — | Envío de formulario | 21 | Redirige a lista de consumos |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 21 | `POST /contratos/:contrato_id/consumos` | Registrar consumo de luz | Datos |

---

## Caso de uso: Listar consumos de luz

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 11 | Detalle de contrato | 11 | Selección de consumos | — | Navega a lista de consumos |
| 22 | Lista de consumos de luz | 22 | Carga de pantalla | — | Muestra lista paginada |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 22 | `GET /contratos/:contrato_id/consumos` | Listar consumos de luz por contrato | Datos |

---

## Caso de uso: Ver detalle de consumo

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 22 | Lista de consumos de luz | 22 | Selección de consumo | — | Navega a detalle |
| 23 | Detalle de consumo | 23 | Carga de pantalla | — | Muestra todos los campos del consumo |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 23 | `GET /contratos/:contrato_id/consumos/:id` | Obtener consumo por id | Datos |

---

## Caso de uso: Registrar pago de consumo

## Frontend

| # | Pantalla | Consume | Acción con respuesta | Envía a | Finaliza |
|---|---|---|---|---|---|
| 23 | Detalle de consumo | 23 | Selección de registrar pago | — | Navega a formulario |
| 24 | Formulario registrar pago de consumo | — | Envío de formulario | 24 | Redirige a detalle de consumo |

## Backend

| # | Endpoint | Responsabilidad | Retorna |
|---|---|---|---|
| 24 | `POST /contratos/:contrato_id/consumos/:id/pagos` | Registrar pago de consumo | Datos |

---
---
