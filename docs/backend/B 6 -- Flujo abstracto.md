
---


## Inquilino

## Inquilino

**#1 — POST /inquilinos — Registrar nuevo inquilino** — Retorna: Datos

```ts
- **Regla de Dominio:** 
	  Validar que el documento único no esté registrado en el sistema.
    
- **Pasos:**
    
    1. Verificar la disponibilidad del documento único del inquilino.
        
    2. Insertar los datos del nuevo inquilino en la base de datos.
        
    3. Retornar el identificador único del nuevo inquilino registrado.
```

**#2 — GET /inquilinos** — Listar inquilinos con paginación — Retorna: Datos

```ts
- **Regla de Dominio:** Ninguna específica de validación previa.
    
- **Pasos:**
    
    1. Consultar y obtener el listado de inquilinos aplicando los 
       parámetros de paginación (página y límite).
        
    2. Retornar la respuesta con la lista paginada de inquilinos.
```

**#3 — GET /inquilinos/:id** — Obtener inquilino por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el inquilino exista en el sistema.
    
- **Pasos:**
    
    1. Comprobar la existencia del inquilino mediante su identificador.
        
    2. Consultar y recuperar todos los campos e información 
       detallada del inquilino.
        
    3. Retornar la respuesta con el detalle del inquilino.
```

**#4 — PUT /inquilinos/:id** — Actualizar inquilino por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el inquilino exista y que el documento único siga siendo válido (no duplicado).
    
- **Pasos:**
    
    1. Comprobar la existencia del inquilino y la disponibilidad 
       del documento único.
        
    2. Actualizar en el repositorio únicamente los campos recibidos 
       a través del DTO.
        
    3. Retornar el identificador del inquilino actualizado.
```

---

## Local

**#5 — POST /locales** — Registrar nuevo local — Retorna: Datos

```ts
- **Regla de Dominio:** Validar que el nombre del local sea único.
    
- **Pasos:**
    
    1. Comprobar que el nombre del nuevo local no se encuentre 
       registrado previamente.
        
    2. Insertar el local en la base de datos.
        
    3. Retornar el identificador del nuevo local creado.
```

**#6 — GET /locales** — Listar locales con paginación — Retorna: Datos

```ts
- **Regla de Dominio:** Ninguna específica.
    
- **Pasos:**
    
    1. Obtener el listado de locales aplicando los parámetros 
       de paginación (página y límite).
        
    2. Retornar la respuesta con la lista de locales.
```

**#7 — GET /locales/:id** — Obtener detalle de local — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el local exista.
    
- **Pasos:**
    
    1. Comprobar la existencia del local por su identificador.
        
    2. Consultar todos los campos correspondientes a dicho local.
        
    3. Retornar la respuesta con el detalle del local.
```

**#8 — PUT /locales/:id** — Actualizar local por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el local exista y que el nombre del local sea único.
    
- **Pasos:**
    
    1. Comprobar la existencia del local y la validez/unicidad del nombre.
        
    2. Actualizar únicamente los campos recibidos en el DTO de actualización.
        
    3. Retornar el identificador del local actualizado.
```

---

## Contrato

**#9 — POST /contratos** — Crear contrato, generar garantía y primera cuota — Retorna: Datos

```ts
- **Regla de Dominio:** Validar que el inquilino exista y esté activo, y que el local exista y se encuentre libre.
    
- **Pasos:**
    
    1. Registrar e insertar el nuevo contrato en la base de datos,
        obteniendo su identificador.
        
    2. Registrar una nueva garantía asociada vinculando el identificador 
       y el monto del contrato.
        
    3. Generar de manera automática todas las cuotas de alquiler del 
       contrato dejándolas en estado pendiente.
        
    4. Registrar el pago correspondiente a la primera cuota de alquiler.
        
    5. Actualizar el estado del local para marcarlo como ocupado.
        
    6. Retornar la respuesta con los datos del nuevo contrato.
```

**#10 — GET /contratos** — Listar contratos con paginación — Retorna: Datos

```ts
- **Regla de Dominio:** Ninguna.
    
- **Pasos:**
    
    1. Consultar y obtener el listado de contratos utilizando los filtros 
       de paginación (página y límite).
        
    2. Retornar la lista paginada de contratos.
```

**#11 — GET /contratos/:id** — Obtener detalles de contrato — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista.
    
- **Pasos:**
    
    1. Comprobar la existencia del contrato en el sistema.
        
    2. Obtener todos los valores y campos principales del contrato.
        
    3. Consultar las cuotas que se encuentren adeudadas 
       (activas o atrasadas) y los registros de consumo de luz pendientes.
        
    4. Calcular el resumen total de la deuda acumulada (cuotas y consumos).
        
    5. Retornar la respuesta con el detalle completo del contrato.
```

**#12 — PUT /contratos/:id** — Actualizar contrato por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista y se encuentre vigente, además de validar inquilino o local si se modifican.
    
- **Pasos:**
    
    1. Si se modifica el inquilino, actualizar el identificador del
        inquilino vinculado al contrato.
        
    2. Si se modifica el local, actualizar el identificador del 
       local vinculado al contrato.
        
    3. Retornar el identificador del contrato actualizado.
```

**#13 — PATCH /contratos/:id/cerrar** — Cerrar contrato por id — Retorna: Booleano

```ts
- **Regla de Dominio:** Verificar que el contrato exista y se encuentre vigente.
    
- **Pasos:**
    
    1. Cambiar el estado del contrato actual a 'cerrado'.
        
    2. Liberar el estado del local asociado, marcándolo 
       nuevamente como libre.
        
    3. Retornar la confirmación del cierre del contrato.
```

**#14 — PATCH /contratos/:id/renovar** — Renovar contrato actualizando fechas y estado — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista, esté activo, no posea deudas y cumpla con la fecha de inicio válida.
    
- **Pasos:**
    
    1. Extraer el saldo restante de la garantía actual del contrato.
        
    2. Cambiar el estado del contrato existente a 'renovado'.
        
    3. Guardar e insertar un nuevo contrato heredando los valores 
       del anterior.
        
    4. Registrar la nueva garantía utilizando el identificador y monto 
       del contrato renovado.
        
    5. Generar las nuevas cuotas de alquiler en estado pendiente.
        
    6. Retornar el identificador del nuevo contrato generado.
```

---

## Garantía

**#15 — GET /garantias/:contrato_id** — Obtener garantía por contrato — Retorna: Datos

```ts
detalleGarantia {
  RD.detalleGarantia();      // el contrato existe y tiene garantía registrada
  obtenerGarantia();         // consulta todos los campos de la garantía
  retornarDatos();           // retorna los datos de la garantía
}
```

**#16 — GET /garantias/:contrato_id/movimientos** — Listar movimientos de garantía — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista y que tenga una garantía asociada.
    
- **Pasos:**
    
    1. Obtener los datos generales de la garantía vinculada al contrato.
        
    2. Obtener la lista de movimientos registrados bajo el identificador 
       de esa garantía.
        
    3. Calcular el saldo actual operando los movimientos sobre 
       el monto registrado.
        
    4. Retornar la respuesta con el detalle de la garantía.
```

**#17 — POST /garantias/:contrato_id/movimientos** — Registrar movimiento de garantía — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista, tenga garantía, esté retenida y que el monto del movimiento no supere el saldo actual de la garantía.
    
- **Pasos:**
    
    1. Registrar el nuevo movimiento de garantía en la base de datos.
        
    2. Obtener y calcular el saldo actual de la garantía tras aplicar 
       el movimiento.
        
    3. Si el saldo resultante llega a ser igual al monto evaluado, 
       actualizar el estado de la garantía según el tipo de acción.
        
    4. Retornar la respuesta del movimiento registrado.
```

---

## Alquiler

**#18 — GET /contratos/:contrato_id/cuotas** — Listar cuotas de alquiler por contrato — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista.
    
- **Pasos:**
    
    1. Extraer y listar todas las cuotas asociadas al contrato recibido
        (incluyendo aquellas que se encuentren anuladas).
        
    2. Retornar la lista de cuotas.
```

**#19 — GET /contratos/:contrato_id/cuotas/:id** — Obtener cuota por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato y la cuota existan, y que la cuota no esté anulada.
    
- **Pasos:**
    
    1. Obtener la información correspondiente al pago registrado sobre 
       el identificador de la cuota.
        
    2. Retornar el detalle de la cuota.
```

**#20 — POST /contratos/:contrato_id/cuotas/:id/pagos** — Registrar pago de alquiler — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista y esté activo, que la cuota exista, sea pagable y que el monto entregado sea igual al monto de la cuota.
    
- **Pasos:**
    
    1. Insertar el registro del pago de alquiler en la base de datos.
        
    2. Actualizar el estado de la cuota correspondiente a pagada.
        
    3. Retornar la respuesta del pago registrado.
```

---

## Consumo de Luz

**#21 — POST /contratos/:contrato_id/consumos** — Registrar consumo de luz — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista y esté activo, y validar la lectura consecutiva (o permitir si es el primer registro).
    
- **Pasos:**
    
    1. Si se trata del primer registro de consumo, obtener la lectura
        inicial de luz desde los valores del contrato.
        
    2. Calcular los valores de consumo en función de la lectura anterior 
       y la lectura ingresada.
        
    3. Registrar e insertar el nuevo consumo de luz en el sistema.
        
    4. Retornar la respuesta con el consumo registrado.
```

**#22 — GET /contratos/:contrato_id/consumos** — Listar consumos de luz por contrato — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista.
    
- **Pasos:**
    
    1. Extraer todos los registros de consumo de luz vinculados al contrato.
        
    2. Retornar la lista de consumos.
```

**#23 — GET /contratos/:contrato_id/consumos/:id** — Obtener consumo por id — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista, que el consumo exista y que no esté anulado.
    
- **Pasos:**
    
    1. Consultar todos los datos generales del consumo de luz.
        
    2. Consultar el pago que se encuentre registrado para dicho consumo.
        
    3. Retornar el detalle del consumo.
```

**#24 — POST /contratos/:contrato_id/consumos/:id/pagos** — Registrar pago de consumo — Retorna: Datos

```ts
- **Regla de Dominio:** Verificar que el contrato exista y esté activo, que el consumo exista, sea pagable y que el monto cubra exactamente el consumo.
    
- **Pasos:**
    
    1. Insertar el registro del pago del consumo en la base de datos.
        
    2. Actualizar el monto pagado y el estado del consumo correspondiente.
        
    3. Retornar la respuesta del pago de consumo registrado.
```