export type DeudaAlquiler = {
    fecha_inicio: Date;
    monto: number;
    monto_pagado: number;
    estado: string;
}

export type DeudaConsumoLuz = {
    fecha_inicio: Date;
    lectura_actual: number;
    monto: number;
    monto_pagado: number;
    estado: string;
}
