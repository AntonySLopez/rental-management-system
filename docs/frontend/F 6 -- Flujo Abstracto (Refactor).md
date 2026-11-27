# F6 — Flujo Abstracto de Pantallas (Refactor)

Documento que define la intención, responsabilidades y el flujo de navegación de la interfaz de usuario en texto claro. Sirve como base para el nuevo diseño visual y la posterior especificación técnica en F8.

---

# Inquilino

### Caso de uso 1: Registrar inquilino

* **Intención:** Dar de alta a un nuevo inquilino en el sistema y acceder directamente a su ficha para verificar que los datos registrados son correctos.
* **Responsabilidad:** 
  * Pantalla Lista de Inquilinos (anfitriona y punto de entrada).
  * Modal Formulario Inquilino (captura y validación de datos).
  * Pantalla Detalle de Inquilino (visualización del registro creado).
* **Flujo de acciones:**
  1. En el Dashboard, el usuario ingresa a la sección de **Inquilinos**, accediendo a la lista general.
  2. Dentro de la lista, pulsa la acción **"Registrar Inquilino"**.
  3. El sistema abre el **modal con el formulario de registro**.
  4. El usuario ingresa los datos correspondientes y confirma el formulario.
  5. El sistema envía los datos a **EP#1** (`POST /inquilinos/register`).
  6. Con la respuesta exitosa y el `id` generado, el modal se cierra y el sistema redirige automáticamente a la pantalla de **Detalle de Inquilino**, cargando su ficha técnica mediante **EP#3** (`GET /inquilinos/:id`).

---

### Caso de uso 2: Listar inquilinos

* **Intención:** Consultar el directorio general de inquilinos registrados en el sistema, visualizando su información básica (documento, teléfono, estado) con capacidad de navegación paginada.
* **Responsabilidad:** 
  * Pantalla Lista de Inquilinos (presentación tabular y control de paginación).
* **Flujo de acciones:**
  1. Desde el Dashboard (o menú lateral), el usuario pulsa en la sección **"Inquilinos"**.
  2. El sistema navega a la pantalla de **Lista de Inquilinos**.
  3. Al cargarse la pantalla, el sistema consulta **EP#2** (`GET /inquilinos?page=1&limit=10`) para obtener el primer bloque de inquilinos.
  4. La pantalla renderiza la tabla mostrando documento, nombre, teléfono y estado de cada inquilino, junto con el control de paginación que indica el total disponible.
  5. Cuando el usuario cambia de página o ajusta la cantidad de elementos por página, el sistema realiza una nueva consulta a **EP#2** con los nuevos parámetros y refresca la tabla.

---

### Caso de uso 3: Ver detalle de inquilino

* **Intención:** Consultar la ficha completa e individual de un inquilino específico (nombre completo, documento, teléfono, correo electrónico, fecha de registro y estado).
* **Responsabilidad:** 
  * Pantalla Lista de Inquilinos (punto de origen / selección de registro).
  * Pantalla Detalle de Inquilino (presentación completa de la ficha técnica).
* **Flujo de acciones:**
  1. En la pantalla de **Lista de Inquilinos**, el usuario pulsa sobre la fila del inquilino deseado (o en su acción "Ver detalle").
  2. El sistema captura el `id` del inquilino y navega a la ruta de **Detalle de Inquilino** (`/inquilinos/:id`).
  3. Al cargarse la pantalla, el sistema extrae el `id` de la URL y solicita la información completa mediante **EP#3** (`GET /inquilinos/:id`).
  4. La pantalla renderiza la ficha del inquilino con todos sus atributos detallados, habilitando acciones como regresar a la lista o iniciar la edición de sus datos.

---

### Caso de uso 4: Actualizar inquilino

* **Intención:** Modificar los datos personales o de contacto de un inquilino registrado (nombre, teléfono, correo electrónico, documento).
* **Responsabilidad:** 
  * Pantalla Detalle de Inquilino (origen y visualización de cambios).
  * Modal Formulario Inquilino (edición de datos precargados).
* **Flujo de acciones:**
  1. Dentro de la pantalla de **Detalle de Inquilino**, el usuario pulsa el botón **"Editar Inquilino"**.
  2. El sistema abre el **modal con el formulario de inquilino**, precargando los campos con los datos actuales.
  3. El usuario modifica los datos necesarios y confirma los cambios.
  4. El sistema envía la información actualizada a **EP#4** (`PATCH /inquilinos/:id`).
  5. Al recibir la confirmación exitosa, el modal se cierra y la pantalla de **Detalle de Inquilino** actualiza sus datos en vista de inmediato.

---
---

# Local

### Caso de uso 5: Registrar local

* **Intención:** Dar de alta un nuevo local comercial en el catálogo de inmuebles y verificar su ficha técnica.
* **Responsabilidad:** 
  * Pantalla Lista de Locales (origen del flujo).
  * Modal Formulario Local (captura de datos: nombre, descripción, área).
  * Pantalla Detalle de Local (visualización del registro creado).
* **Flujo de acciones:**
  1. Desde el Dashboard, el usuario accede a la sección de **Locales**.
  2. En la barra de acciones de la lista, pulsa **"Registrar Local"**.
  3. El sistema abre el **modal con el formulario de local**.
  4. El usuario completa los datos requeridos (nombre, área en m² y descripción opcional) y confirma el envío.
  5. El sistema envía la solicitud a **EP#5** (`POST /locales/register`).
  6. Al responder exitosamente con el nuevo `id`, el modal se cierra y el sistema navega automáticamente a la pantalla de **Detalle de Local**, cargando sus datos mediante **EP#7** (`GET /locales/:id`).

---

### Caso de uso 6: Listar locales

* **Intención:** Visualizar el inventario general de locales comerciales con su nombre, área asignada y estado actual (libre u ocupado), con soporte de paginación.
* **Responsabilidad:** 
  * Pantalla Lista de Locales (vista tabular y control de paginación).
* **Flujo de acciones:**
  1. El usuario hace clic en **"Locales"** en el menú de navegación.
  2. El sistema navega a la pantalla de **Lista de Locales**.
  3. Al cargarse, la pantalla realiza la petición a **EP#6** (`GET /locales?page=1&limit=10`).
  4. La pantalla muestra la tabla con la lista de locales, su área, estado actual y el paginador correspondiente.
  5. Al interactuar con el control de páginas, el sistema solicita a **EP#6** el nuevo segmento de datos y refresca la vista.

---

### Caso de uso 7: Ver detalle de local

* **Intención:** Consultar las especificaciones y estado operativo de un local comercial específico.
* **Responsabilidad:** 
  * Pantalla Lista de Locales (selección del local).
  * Pantalla Detalle de Local (presentación de la ficha técnica).
* **Flujo de acciones:**
  1. En la **Lista de Locales**, el usuario hace clic sobre la fila del local deseado.
  2. El sistema captura el `id` y navega a la ruta de **Detalle de Local** (`/locales/:id`).
  3. La pantalla se inicializa consultando **EP#7** (`GET /locales/:id`).
  4. Se muestra la información detallada del local (nombre, descripción, área exacta en m² y estado de ocupación), ofreciendo botones para editarlo o regresar a la lista.

---

### Caso de uso 8: Actualizar local

* **Intención:** Modificar las características registradas de un local comercial (nombre, descripción o área).
* **Responsabilidad:** 
  * Pantalla Detalle de Local (origen y visualización de cambios).
  * Modal Formulario Local (edición con campos precargados).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Local**, el usuario pulsa **"Editar Local"**.
  2. El sistema abre el **modal de formulario**, precargado con el nombre, descripción y área actuales del local.
  3. El usuario aplica las correcciones y confirma.
  4. El sistema envía los datos modificados a **EP#8** (`PATCH /locales/:id`).
  5. Con la respuesta exitosa, el modal se cierra y la pantalla de detalle actualiza la información visualmente.

---
---

# Contrato

### Caso de uso 9: Crear contrato

* **Intención:** Formalizar un nuevo acuerdo de arrendamiento vinculando a un inquilino activo con un local libre, registrando las condiciones económicas pactadas, la lectura inicial de luz y el pago de apertura (garantía y primera cuota).
* **Responsabilidad:** 
  * Pantalla Lista de Contratos (punto de inicio).
  * Pantalla Crear Contrato (formulario guiado con selectores de inquilinos y locales).
  * Pantalla Detalle de Contrato (destino final tras formalización).
* **Flujo de acciones:**
  1. Desde la **Lista de Contratos**, el usuario pulsa el botón principal **"Crear Contrato"**.
  2. El sistema navega a la pantalla completa de **Crear Contrato** (`/contratos/crear`).
  3. Al iniciar, la pantalla precarga los selectores consultando los inquilinos disponibles mediante **EP#2** y los locales libres mediante **EP#6**.
  4. El usuario selecciona el inquilino, el local libre e ingresa las condiciones: precio mensual, monto de garantía, lectura inicial del medidor de luz, fecha de inicio, duración en meses, observaciones, método de pago inicial y referencia.
  5. El usuario envía el formulario y el sistema despacha los datos a **EP#9** (`POST /contratos`).
  6. Al crearse el contrato (generando su garantía y primera cuota en el backend), el sistema redirige automáticamente a la pantalla de **Detalle de Contrato** (`/contratos/:id`), consultando la información completa mediante **EP#11**.

---

### Caso de uso 10: Listar contratos

* **Intención:** Supervisar el padrón general de contratos celebrados, visualizando inquilino, local arrendado, canon mensual, fechas de vigencia y estado.
* **Responsabilidad:** 
  * Pantalla Lista de Contratos (tabla con paginación y filtros de estado).
* **Flujo de acciones:**
  1. El usuario selecciona **"Contratos"** en el menú principal.
  2. El sistema navega a la pantalla de **Lista de Contratos**.
  3. Al cargarse, consulta **EP#10** (`GET /contratos?page=1&limit=10`).
  4. La pantalla muestra la tabla con las columnas: inquilino, local, precio mensual, fecha de inicio, duración y estado (activo, renovado, cerrado), junto con el control de paginación.
  5. Al cambiar de página, se consulta nuevamente **EP#10** con el número de página seleccionado y se refrescan las filas.

---

### Caso de uso 11: Ver detalle de contrato

* **Intención:** Centralizar la gestión operativa de un contrato en una sola vista: datos generales de las partes, balance global de deuda (cuotas vencidas + consumos pendientes) y acceso estructurado a sus cuotas, consumos y fondo de garantía.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (hub operativo central del arriendo).
* **Flujo de acciones:**
  1. En la **Lista de Contratos**, el usuario selecciona una fila de contrato.
  2. El sistema navega a la ruta de **Detalle de Contrato** (`/contratos/:id`).
  3. Al cargarse, la pantalla solicita los datos completos mediante **EP#11** (`GET /contratos/:id`).
  4. La pantalla presenta:
     - Cabecera con datos del inquilino, local y estado del contrato.
     - Indicador destacado con el balance de deuda (`total_cuotas_adeudadas`, `total_consumos_pendientes` y `total_deuda`).
     - Botones de acción principales: Editar contrato, Renovar contrato y Cerrar contrato.
     - Pestañas organizadas para gestionar: **Cuotas de Alquiler**, **Consumos de Luz** y **Garantía**.

---

### Caso de uso 12: Actualizar contrato

* **Intención:** Modificar el local asignado o las observaciones registradas de un contrato que se encuentra vigente.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen y refresco).
  * Modal Editar Contrato (formulario contextual de edición).
* **Flujo de acciones:**
  1. Dentro de la pantalla de **Detalle de Contrato**, el usuario pulsa **"Editar Contrato"**.
  2. El sistema abre el **modal de edición de contrato**, precargando el selector con locales libres (vía **EP#6**) y las observaciones actuales.
  3. El usuario modifica los datos permitidos y confirma el formulario.
  4. El sistema envía los cambios a **EP#12** (`PATCH /contratos/:id`).
  5. Al confirmarse la actualización, el modal se cierra y la pantalla de detalle recarga sus datos mediante **EP#11** para reflejar la nueva información.

---

### Caso de uso 13: Cerrar contrato

* **Intención:** Dar por concluido un contrato vigente (activo o renovado), cambiando su estado a cerrado e inhabilitando futuras operaciones sobre él.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Diálogo de Confirmación (prevención de cierre accidental).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Contrato**, el usuario pulsa el botón **"Cerrar Contrato"**.
  2. El sistema abre un **diálogo modal de confirmación**, alertando sobre la finalización del contrato.
  3. El usuario confirma la acción.
  4. El sistema envía la orden a **EP#13** (`PATCH /contratos/:id/cerrar`).
  5. Al responder con éxito, el diálogo se cierra, el estado en la pantalla cambia inmediatamente a `cerrado` y los botones de cobro, renovación o cierre quedan inhabilitados.

---

### Caso de uso 14: Renovar contrato

* **Intención:** Extender el arrendamiento de un contrato activo que no tiene deudas pendientes, estableciendo una nueva fecha de inicio y actualizando opcionalmente el precio mensual.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Modal Renovar Contrato (captura de nueva fecha de inicio y precio).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Contrato**, el usuario hace clic en **"Renovar Contrato"**.
  2. El sistema abre el **modal de renovación**.
  3. El usuario define la nueva fecha de inicio (que debe ser posterior a la última cuota pagada), el nuevo precio mensual (si varía) y las observaciones.
  4. Al confirmar, el sistema despacha los datos a **EP#14** (`PATCH /contratos/:id/renovar`).
  5. Al procesarse con éxito, el modal se cierra y el sistema recarga el detalle del contrato mediante **EP#11**, mostrando el nuevo periodo y estado renovado.

---
---

# Garantía

### Caso de uso 15: Ver detalle de garantía

* **Intención:** Supervisar el estado financiero de la garantía del contrato, conociendo el monto pactado originalmente y el saldo real disponible tras depósitos, devoluciones o consumos.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato / Pestaña Garantía (tarjeta resumen de balance).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Contrato**, el usuario selecciona la pestaña **"Garantía"**.
  2. El sistema consulta **EP#15** (`GET /garantias/:contrato_id`).
  3. La sección renderiza la tarjeta de garantía mostrando: monto pactado, saldo actual disponible, fecha de registro, fecha de cierre (si aplica), estado (retenida, devuelta, consumida) y observaciones.

---

### Caso de uso 16: Listar movimientos de garantía

* **Intención:** Auditar el historial cronológico de operaciones financieras aplicadas sobre la garantía (depósitos adicionales, devoluciones parciales/totales o retenciones por consumo).
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato / Pestaña Garantía (tabla de movimientos paginada).
* **Flujo de acciones:**
  1. Dentro de la pestaña de **Garantía**, el sistema consulta **EP#16** (`GET /garantias/:contrato_id/movimientos?page=1&limit=10`).
  2. La vista muestra la tabla histórica detallando: fecha de registro, tipo de acción (`deposito`, `devuelta`, `consumida`), monto, método de pago, referencia y observaciones.
  3. Si existen múltiples páginas de movimientos, el usuario puede navegar entre ellas refrescando los datos desde **EP#16**.

---

### Caso de uso 17: Registrar movimiento de garantía

* **Intención:** Ingresar una nueva operación de ajuste sobre el saldo de la garantía retenida (añadir depósito, registrar devolución o liquidar consumo).
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (anfitriona).
  * Modal Registrar Movimiento de Garantía (formulario de captura).
* **Flujo de acciones:**
  1. En la pestaña de **Garantía**, el usuario pulsa **"Nuevo Movimiento"**.
  2. El sistema despliega el **modal de movimiento de garantía**.
  3. El usuario indica el tipo de acción (`deposito`, `devuelta` o `consumida`), el monto (validando que no supere el saldo disponible en devoluciones), el método de pago, la referencia y las observaciones.
  4. Al confirmar, los datos se envían a **EP#17** (`POST /garantias/:contrato_id/movimientos/registrar`).
  5. Al responder con éxito, el modal se cierra y el sistema actualiza automáticamente tanto el saldo de la garantía (vía **EP#15**) como la tabla de movimientos (vía **EP#16**).

---
---

# Alquiler y Cuotas

### Caso de uso 18: Listar cuotas de alquiler

* **Intención:** Visualizar el cronograma completo de mensualidades del contrato, sus fechas de vencimiento, montos asignados y estado de pago (pendiente, pagado, atrasado o anulado).
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato / Pestaña Cuotas (tabla del cronograma de pagos).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Contrato**, el usuario selecciona la pestaña **"Cuotas"**.
  2. El sistema realiza la consulta a **EP#18** (`GET /alquiler/:contrato_id/cuotas`).
  3. La tabla despliega todas las cuotas generadas para el contrato, indicando para cada una: periodo/fechas, fecha límite de vencimiento, monto a pagar y una insignia visual con su estado.
  4. En las cuotas pendientes o atrasadas se muestra habilitada la acción de **"Pagar"**; en las cuotas pagadas se muestra la acción de **"Ver Pago"**.

---

### Caso de uso 19: Ver detalle de cuota

* **Intención:** Consultar el comprobante de pago registrado para una cuota ya cancelada, verificando método de pago, referencia bancaria y fecha de recaudación.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Modal Detalle de Pago (presentación de comprobante).
* **Flujo de acciones:**
  1. En la tabla de cuotas, el usuario pulsa sobre una cuota que tiene estado `pagado`.
  2. El sistema consulta **EP#19** (`GET /alquiler/:contrato_id/cuotas/:id`).
  3. Se despliega un **modal informativo** con los datos del pago registrado: monto cobrado, medio de pago utilizado, número de operación/referencia, fecha exacta de registro y observaciones.
  4. El usuario revisa los datos y cierra el modal para volver a la tabla.

---

### Caso de uso 20: Registrar pago de alquiler

* **Intención:** Asentar el cobro de una cuota de alquiler pendiente o atrasada, amortizando la deuda del contrato.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (anfitriona).
  * Modal Registrar Pago de Alquiler (formulario de cobro).
* **Flujo de acciones:**
  1. En la tabla de cuotas, el usuario pulsa el botón **"Pagar"** de una cuota en estado pendiente o atrasada.
  2. El sistema abre el **modal de registro de pago**, precargando el monto exacto obligatorio de la cuota.
  3. El usuario selecciona el método de pago (`efectivo`, `transferencia`, `deposito_bancario`), ingresa el número de referencia y comentarios opcionales.
  4. El usuario confirma y el sistema envía los datos a **EP#20** (`POST /alquiler/:contrato_id/cuotas/:id/pagos`).
  5. Al confirmarse el pago, el modal se cierra, la cuota cambia a estado `pagado` en la tabla y se actualiza el resumen general de deuda del contrato (vía **EP#11**).

---
---

# Consumo de Luz

### Caso de uso 21: Registrar consumo de luz

* **Intención:** Registrar una nueva lectura periódica del medidor eléctrico del local para generar el recibo de cobro de energía correspondiente.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Modal Registrar Consumo (captura de lecturas y cálculo tarifario).
* **Flujo de acciones:**
  1. En la pantalla de **Detalle de Contrato**, el usuario va a la pestaña **"Consumos de Luz"** y pulsa **"Registrar Consumo"**.
  2. El sistema abre el **modal de registro de consumo**, precargando como `lectura_anterior` la última lectura registrada o la lectura inicial pactada en el contrato.
  3. El usuario completa el periodo (fecha inicio y fecha fin), ingresa la nueva `lectura_actual` (debe ser igual o superior a la anterior), el precio por kWh y el alumbrado público.
  4. El sistema envía la información a **EP#21** (`POST /consumo/:contrato_id/registrar`).
  5. Con la respuesta exitosa, el modal se cierra y el sistema recarga la lista de consumos y el balance de deuda del contrato.

---

### Caso de uso 22: Listar consumos de luz

* **Intención:** Visualizar el historial cronológico de lecturas y facturaciones de energía eléctrica emitidas al contrato, observando kWh consumidos, montos totales y estado de pago.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato / Pestaña Consumos de Luz (tabla de consumos).
* **Flujo de acciones:**
  1. En el **Detalle de Contrato**, el usuario pulsa en la pestaña **"Consumos de Luz"**.
  2. El sistema consulta **EP#22** (`GET /consumo/:contrato_id/`).
  3. La tabla despliega los consumos generados: periodo de facturación, total de kWh consumidos, monto liquidado y estado (`pendiente` o `pagado`).
  4. Cada fila ofrece acciones según su estado: **"Registrar Pago"** (si está pendiente) o **"Ver Detalle"** (si ya cuenta con pago o para ver el desglose).

---

### Caso de uso 23: Ver detalle de consumo

* **Intención:** Inspeccionar el cálculo detallado de un consumo de luz (lecturas, tarifa por kWh, cargo de alumbrado público) y consultar los datos de su pago si ya fue cancelado.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Modal Detalle de Consumo (ficha técnica y comprobante).
* **Flujo de acciones:**
  1. En la tabla de consumos, el usuario hace clic sobre un consumo específico.
  2. El sistema consulta **EP#23** (`GET /consumo/:contrato_id/detalle/:id`).
  3. Se abre el **modal con el desglose**:
     - Datos de cálculo: lectura anterior, lectura actual, consumo total en kWh, precio por kWh, importe de alumbrado público y monto final.
     - Bloque de pago: si el estado es pagado, muestra el medio de pago, referencia y fecha de registro; si está pendiente, indica que no tiene pago registrado.
  4. El usuario revisa los detalles y cierra el modal.

---

### Caso de uso 24: Registrar pago de consumo

* **Intención:** Liquidar la deuda originada por un recibo de consumo de luz pendiente de pago.
* **Responsabilidad:** 
  * Pantalla Detalle de Contrato (origen).
  * Modal Registrar Pago de Consumo (formulario de cobro).
* **Flujo de acciones:**
  1. En la lista de consumos, sobre un registro pendiente, el usuario pulsa **"Registrar Pago"**.
  2. El sistema despliega el **modal de pago de consumo**, con el monto total bloqueado para coincidir exactamente con el valor del consumo.
  3. El usuario selecciona el método de pago, escribe la referencia de pago y observaciones si corresponde.
  4. Al confirmar, el sistema despacha los datos a **EP#24** (`POST /consumo/:contrato_id/pagar/:id`).
  5. Al recibir la confirmación, el modal se cierra, el consumo pasa a estado `pagado` y se descuenta el valor pagado de la deuda total del contrato.

---
---

# Funcionalidades Transversales

### Caso de uso 25: Visualizar Dashboard

* **Intención:** Ofrecer al administrador un panel de control con métricas clave del negocio, resumen de cobros pendientes y accesos directos al iniciar sesión.
* **Responsabilidad:** 
  * Pantalla Dashboard (`/dashboard`).
* **Flujo de acciones:**
  1. Tras iniciar sesión o al hacer clic en el logotipo/inicio, el usuario ingresa a la pantalla de **Dashboard**.
  2. La pantalla presenta contadores rápidos (locales ocupados vs libres, contratos vigentes, total adeudado acumulado).
  3. Brinda enlaces directos hacia la creación de contratos y listados de inquilinos y locales.

---

### Caso de uso 26: Iniciar y Cerrar Sesión

* **Intención:** Controlar el acceso seguro a la plataforma mediante credenciales y permitir finalizar la sesión de trabajo.
* **Responsabilidad:** 
  * Pantalla de Login (`/login`).
  * Layout General (botón de cierre de sesión en la cabecera).
* **Flujo de acciones:**
  1. El usuario no autenticado ingresa a la URL del sistema y es derivado a la pantalla de **Login**.
  2. Ingresa sus credenciales (usuario/contraseña) y pulsa "Ingresar".
  3. El sistema valida las credenciales, almacena el token de sesión y navega a la pantalla de **Dashboard**.
  4. Desde cualquier pantalla, el usuario puede pulsar la acción **"Cerrar Sesión"** en la barra superior para destruir el token y ser redirigido nuevamente al **Login**.
