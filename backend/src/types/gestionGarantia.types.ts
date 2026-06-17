export type GarantiaUpdate = {
    fecha_movimiento: Date;
    observaciones?: string;
    estado_id: string;
    movimiento_id: number;
};

export type GarantiaMovimiento = {
    id: number;
    contrato_id: number;
    monto: number;
    observaciones?: string;
};
