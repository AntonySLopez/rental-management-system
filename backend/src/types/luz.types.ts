export type Luz = {
    contrato_id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    lectura_anterior: number;
    lectura_actual?: number;
    precio_kwh: number;
    alumbrado_publico?: number;
    consumo_total?: number;
    monto?: number;
    monto_pagado?: number;
};
