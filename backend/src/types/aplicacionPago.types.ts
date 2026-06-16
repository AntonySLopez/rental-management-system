export type AplicacionPagoAlquiler = {
    movimiento_id: number;
    cuota_alquiler_id: number;
    monto_aplicado: number;
    fecha_aplicacion: Date;
}

export type AplicacionPagoLuz = {
    movimiento_id: number;
    consumo_luz_id: number;
    monto_aplicado: number;
    fecha_aplicacion: Date;
}
