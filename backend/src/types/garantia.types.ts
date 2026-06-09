export type Garantia = {
    contrato_id: number;
    monto: number;
    fecha_registro: Date;
    fecha_movimiento?: Date;
    observaciones?: string;
};