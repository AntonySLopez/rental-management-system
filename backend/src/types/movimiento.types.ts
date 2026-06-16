export type Movimiento = {
    contrato_id: number;
    fecha: Date;
    monto: number;
    metodo_pago: string;
    referencia?: string;
    descripcion?: string;
}
