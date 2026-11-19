// Tipos de respuesta según B7

export interface DetalleGarantiaResponse {
    id: string;
    contrato_id: string;
    monto: number;
    saldo: number;
    fecha_registro: string;
    fecha_cierre: string | null;
    observaciones: string | null;
    estado: string;
}

export interface MovimientoGarantiaItem {
    id: string;
    fecha_registro: string;
    monto: number;
    metodo_pago: string;
    referencia: string | null;
    tipo_accion: string;
    observaciones: string | null;
}

export interface ListarMovimientosGarantiaResponse {
    data: MovimientoGarantiaItem[];
    total: number;
    page: number;
    limit: number;
}

export interface NuevoMovimientoGarantiaResponse {
    id: string;
}
