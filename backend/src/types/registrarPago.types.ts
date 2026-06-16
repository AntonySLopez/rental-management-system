export type PagosPendientes <T> = {
    id: number;
    fecha_inicio: Date;
    monto: number;
    monto_pagado: number;
    estado: string;
    to_pay?: number;
    type: T;
};

export type PagoAlquiler = {
    movimiento_id: number;
    cuota_alquiler_id: number;
    monto_aplicado: number;
    fecha_aplicacion: Date;
};

export type PagoLuz = {
    movimiento_id: number;
    consumo_luz_id: number;
    monto_aplicado: number;
    fecha_aplicacion: Date;
};
