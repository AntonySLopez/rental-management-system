
## B8 — Inquilinos

**#1 — POST /inquilinos — Registrar nuevo inquilino**

```ts
registrarInquilino {

  RD.registrarInquilino:
    - documentoUnico.repository()      // se espera true

  operation1(){
    registrarInquilino.repository()
    // inserta el inquilino, retorna su id
  }
  respuesta    // retorna el id del nuevo inquilino
}
```

---

**#2 — GET /inquilinos — Listar inquilinos con paginación**

```ts
listarInquilinos {

  operation2(){
    listarInquilinos.repository()   
    // obtiene inquilinos según page y limit
  }
  respuesta    // ListarInquilinosResponse
}
```

---

**#3 — GET /inquilinos/:id — Obtener inquilino por id**

```ts
detalleInquilino {

  RD.detalleInquilino:
    - inquilinoExiste.repository()        // se espera true

  operation3(){
    obtenerInquilinoById.repository()           
    // obtiene todos los campos del inquilino
  }
  respuesta    // retorna DetalleInquilinoResponse
}
```

---

**#4 — PUT /inquilinos/:id — Actualizar inquilino**

```ts
actualizarInquilino {

  RD.actualizarInquilino:
    - inquilinoExiste.repository()     // se espera true
    - documentoUnico.repository()      // se espera true

  operation4(){
    editarInquilino.repository()         
    // actualiza solo los campos recibidos en el DTO
  }
  respuesta     // retorna el id del inquilino actualizado
}
```

---
---

## B8 — Locales

**#5 — POST /locales — Registrar nuevo local**

```ts
registrarLocal {

  RD.registrarnuevoLocal:
    - nombreLocalUnico.repository()       // se espera true
  
  operation5(){
    guardarLocal.repository()
    // inserta el local, retorna su id
  }
  respuesta      // retorna el id del nuevo local
}
```

---

**#6 — GET /locales — Listar locales con paginación**

```ts
listarLocales {
  
  operation6(){
    listarLocales.repository()      
    // obtiene locales según page y limit
  }
  respuesta       // ListarLocalesResponse
}
```

---

**#7 — GET /locales/:id — Obtener detalle de local**

```ts
detalleLocal {

  RD.detalleLocal:
    - localExiste.repository()            // se espera true
  
  operation7(){
    obtenerLocalById.repository()               
    // consulta todos los campos del local
  }
  respuesta        // retorna DetalleLocalResponse
}
```

---

**#8 — PUT /locales/:id — Actualizar local**

```ts
actualizarLocal {

  RD.actualizarLocal:
    - localExiste.repository()         // se espera true
    - nombreLocalUnico.repository()    // se espera true

  operation8(){
    actualizarLocalById.repository()             
    // actualiza solo los campos recibidos en el DTO
  }
  respuesta       // retorna el id del local actualizado
}
```

---
---

## B8 — Contratos

**#9 — POST /contratos — Crear contrato**

```ts
nuevoContrato {

  RD.nuevoContrato:
    - inquilinoExiste.repository()         // se espera true
    - inquilinoActivo.repository()         // se espera true
    - localExiste.repository()             // se espera true
    - localLibre.repository()              // se espera true

  operation9(){
    registrarContrato.repository()
    // inserta el contrato, retorna contrato_id
    registrarNuevaGarantia.repository()
    // registra nueva garantia con id y monto del contrato
    crearCuotasDeAlquiler.repository()
    // genera todas las cuotas del contrato, en estado pendiente
    registrarPagoAlquiler.repository()
    // registra el pago de la primera cuota de alquiler
    actualizarEstadoLocal.repository()
    // marca el local como ocupado
  }
  respuesta        // retorna NuevoContratoResponse
}
```

---

**#10 — GET /contratos — Listar contratos con paginación**

```ts
listarContratos {

  operation10(){
    listarContratos.repository()
    // obtiene contratos segun page y limit
  }
  respuesta        // ListarContratosResponse
}
```

---

**#11 — GET /contratos/:id — Obtener detalle de contrato**

```ts
detalleContrato {

  RD.detalleContrato:
    - contratoExiste.repository()         // se espera true

  operation11(){
    obtenerContrato.repository()
    // obtiene todos los valores del contrato
    obtenerCuotasAdeudadas.repository()
    // obtiene todas las cuotas con estado activo o atrasado
    ontenerConsumoAdeudado.respository()
    // obtiene todas los registros con estado pentiende
  }
  calcularDeuda():DeudaResumen
  // calcula el total de cuotas con deuda y consumos de luz
  respuesta          // retorna DetalleContratoResponse
}
```

---

**#12 — PATCH /contratos/:id — Actualizar local de contrato por id**

```ts
actualizarContrato() {

  RD.actualizarContrato:
    - contratoExiste.repository()          // se espera true
    - contratoVigente.repository()         // se espera true
    - localExiste.repository()             // ? se espera true
    - localLibre.repository()              // ? se espera true

  operation13(){
    alternarDisponibilidadLocal.repository()
    // marca el local como ocupado y libera el anterior
    actualizarContratoLocal.repository()
    // actualiza local_id en el contrato
    actualizarContratoObservaciones.repository()
    // actualiza observaciones del contrato
  }
  respuesta         // retornar id de contrato
}
```

---

**#13 — PATCH /contratos/:id/cerrar — Cerrar contrato**

```ts
cerrarContrato {

  RD.cerrarContrato:
    - contratoExiste.repository()          // se espera true
    - contratoVigente.repository()         // se espera true

  operation14(){
    cerrarContrato.repository()
    // cambia el estado del contrato a 'cerrado'
    liberarEstadoLocal.repository()
    // marca el local como libre
  }
  respuesta          // confirma el cierre del contrato
}
```

---

**#14 — PATCH /contratos/:id/renovar — Renovar contrato**

```ts
renovarContrato {

  RD.renovarContrato:
    - contratoExiste.repository()              // se espera true
    - contratoActivo.repository()              // se espera true
    - contratoSinDeuda.repository()            // se espera true
    - fechaInicioValido.repository()           // se espera true

  operation15(){
    garantia = extraerGarantiaByid.repository()
    // retira el saldo restante de la garantía del contrato actual
    renovarContrato.repository()
    // cambia el estado del contrato a 'renovado'
    obtenerDatosContrato.repository()
    // obtiene los datos del contrato actual para reutilizar
    registrarContrato.repository()
    // inserta el contrato nuevo con los valores del anterior
    registrarNuevaGarantia.repository(garantia)
    // registra nueva garantia con id y monto del contrato renovado
    crearCuotasDeAlquiler.repository()
    // genera todas las cuotas del contrato, en estado pendiente
    registrarPagoAlquiler.repository()
    // registra el pago de la primera cuota de alquiler
  }
  respuesta            // retorna el id del contrato nuevo
}
```

---
---

## B8 — Garantías

**#15 — GET /garantias/:contrato_id — Obtener garantía por contrato**

```ts
detalleGarantia {

  RD.detalleGarantia:
    - contratoExiste.repository()          // se espera true
    - contratoTieneGarantia.repository()   // se espera true

  operation16(){
    obtenerGarantia.repository()
    // obtiene los datos de la garantía del contrato
    obtenerMovimientoGarantia.repository()
    // obtiene los movimientos realizados bajo el id de garantía
    calcularSaldo()
    // calcula el saldo: monto - movimientos
  }

  respuesta           // retorna DetalleGarantiaResponse
}
```

---

**#16 — GET /garantias/:contrato_id/movimientos — Listar movimientos de garantía**

```ts
listarMovimientosGarantia {

  RD.listarMovimientosGarantia:
    - contratoExiste.repository()          // se espera true
    - contratoTieneGarantia.repository()   // se espera true

  operation18(){
    obtenerGarantia.repository()
    // obtiene garantia_id del contrato
    listarMovimientos.repository()
    // obtiene movimientos con paginación
  }

  respuesta         // ListarMovimientosGarantiaResponse
}
```

---

**#17 — POST /garantias/:contrato_id/movimientos/registrar — Registrar movimiento de garantía**

```ts
nuevoMovimientoGarantia {

  RD.nuevoMovimientoGarantia:
    - contratoExiste.repository()                // se espera true
    - contratoTieneGarantia.repository()         // se espera true
    - garantiaRetenida.repository()              // se espera true
    - montoNoSuperaSaldoGarantia.repository()    // se espera true

  operation19(poolClient){
    obtenerGarantia.repository()
    // obtiene garantia_id del contrato
    registrarMovimientoGarantia.repository()
    // registra el movimiento de garantía
    obtenerMovimientoGarantia.repository()
    // obtiene el saldo actual de movimientos
    
    ! /* si saldo de movimientos es igual a monto de garantía */
    actualizarEstadoGarantia.repository()
    // cambia estado según tipo_accion
    
    return garantia_id
  }

  respuesta         // NuevoMovimientoGarantiaResponse
}
```

---
---

# Alquiler

**#18 — GET /alquiler/:contrato_id/cuotas** — Listar cuotas de alquiler por contrato — Retorna: Datos

```ts
listarCuotas {

  RD.listarCuotas:
    - contratoExiste.repository()          // se espera true

  operation21(){
    listarCuotas.repository()
    // extrae todas las cuotas del contrato recibido, incluidas las anuladas
  }
  
  respuesta          // ListarCuotasResponse
}
```

---

**#19 — GET /alquiler/:contrato_id/cuotas/:id** — Obtener pago de cuota por id — Retorna: Datos

```ts
detalleCuota {

  RD.detalleCuota:
    - contratoExiste.repository()          // se espera true
    - cuotaExiste.repository()             // se espera true
    - cuotaNoAnulada.repository()          // se espera true

  operation22(){
    obtenerPagoAlquiler.repository()
    // obtiene informacion del pago registrado sobre la cuota_id
  }
  respuesta           // retorna PagoAlquilerResponse
}
```

---

**#20 — POST /alquiler/:contrato_id/cuotas/:id/pagos** — Registrar pago de alquiler — Retorna: Datos

```ts
nuevoPagoAlquiler {
    RD.nuevoPagoAlquiler:
    - contratoExiste.repository()          // se espera true
    - contratoActivo.repository()          // se espera true
    - cuotaExiste.repository()             // se espera true
    - cuotaPagable.repository()            // se espera true
    - montoIgualAMontoCuota.repository()   // se espera true
    - cuotaSiguiente.repository()          // se espera true
  
  operation23(){
    registrarPagoAlquiler.repository()
    // inserta el pago en la base de datos
    actualizarCuota.repository()
    // actualiza estado a pagado
  }
  respuesta         // retorna NuevoPagoAlquilerResponse
}
```


---
---

# Consumo Luz

**#21 — POST /consumo/:contrato_id/registrar** — Registrar consumo de luz — Retorna: Datos

```ts
nuevoConsumo {
  RD.nuevoConsumo: 'nuevo' | 'existente'
	- contratoExiste.repository()                // se espera true 
	- contratoActivo.repository()                // se espera true 
	- lecturasConsecutiva.repository() !         // se espera true 
	  // si es primer registro responde true

  ! /*  Si es primera cuota  */
  lecturaAnterior = obtenerContrato.repository(): lectura_inicial_luz
    // obtiene todos los valores del contrato
 
  operation24(){
    consumo = calcularConsumo(lecturaAnterior | input.lecturaAnterior);      
    // calcula y formatea valores de consumo
    registrarConsumo.repository(consumo);          
    // registra consumo de luz
  }
  
  respuesta        // retorna NuevoConsumoResponse
  
}
```

---

**#22 — GET /consumo/:contrato_id/** — Listar consumos de luz por contrato — Retorna: Datos

```ts
listarConsumos {

  RD.listarConsumos:
    - contratoExiste.repository()        // se espera true

  operation25(){
    listasConsumosLuz.repository()
	// extrae todos los registro de consumo de luz
  }
  respuesta         // retorna ListarConsumosResponse
}
```

---

**#23 — GET /consumo/:contrato_id/detalle/:id** — Obtener consumo por id — Retorna: Datos

```ts
detalleConsumo {

  RD.detalleConsumo:
    - contratoExiste.repository()        // se espera true
    - consumoExiste.repository()         // se espera true
    - consumoNoAnulado.repository()      // se espera true

  operation26(){
    obtenerConsumo.repository()            
    // consulta todos los datos del consumo de luz
    obtenerPagoConsumo.repository()        
    // consulta el pago registrado del consumo
  }

  respuesta          // retorna DetalleConsumoResponse
}
```

---

**#24 — POST /consumo/:contrato_id/pagar/:id** — Registrar pago de consumo — Retorna: Datos

```ts
nuevoPagoConsumo {
  RD.nuevoPagoConsumo: 
	- contratoExiste.repository()               // se espera true 
	- contratoActivo.repository()               // se espera true 
	- consumoExiste.repository()                // se espera true 
	- consumoPagable.repository()               // se espera true 
	- montoIgualAMontoConsumo.repository()      // se espera true
	  
  operation27(){
    registrarPagoConsumo.repository()   
    // inserta el pago en la base de datos
    actualizarConsumo.repository()     
    // actualiza monto_pagado y estado del consumo
  }
  respuesta       // retorna NuevoPagoConsumoResponse
}
```