
### Propietario

| Entidad | Operaciones | Restricciones |
|---|---|---|
| Inquilino | Crear, Leer, Actualizar | No eliminar si tiene contrato activo |
| Local | Crear, Leer, Actualizar | No eliminar si tiene contrato activo. No asignar si estado != libre |
| Contrato | Crear, Leer, Actualizar, Cerrar | No crear si local está ocupado. No cerrar con deuda pendiente |
| Garantía | Leer | Solo se crea desde contrato. No modificar monto_inicial |
| Movimiento garantía | Crear, Leer | No registrar devolución si monto_actual > 0 tras consumos. No registrar sobre contrato cerrado |
| Cuota alquiler | Leer | Solo se genera desde contrato. No modificar monto |
| Pago alquiler | Crear, Leer | No registrar sobre cuota ya pagada. No registrar sobre contrato cerrado |
| Consumo luz | Crear, Leer | No registrar si local sin contrato activo. lectura_actual debe ser mayor a lectura_anterior |
| Pago consumo | Crear, Leer | No registrar sobre consumo ya pagado. No registrar sobre contrato cerrado |