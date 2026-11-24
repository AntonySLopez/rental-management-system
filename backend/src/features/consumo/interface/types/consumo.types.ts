// Tipos de respuesta según B7

export interface NuevoConsumoResponse {
    id: string; // id del nuevo consumo
}

export interface ConsumoInput {
    contrato_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    lectura_anterior: number;
    lectura_actual: number;
    precio_kwh: number;
    alumbrado_publico: number;
    monto: number;
}

export interface ConsumoItem {
    id: string;
    fecha_inicio: string;       // YYYY-MM-DD
    fecha_fin: string;          // YYYY-MM-DD
    consumo_kwh_total: number;
    monto: number;
    estado: string;
}

export interface ListarConsumosResponse {
    data: ConsumoItem[];
}

export interface PagoConsumoItem {
    id: string;
    monto: number;
    metodo_pago: string;
    referencia: string | null;
    fecha_registro: string;       // ISO 8601
    observaciones: string | null;
}

export interface DetalleConsumoResponse {
    id: string;
    contrato_id: string;
    fecha_inicio: string;         // YYYY-MM-DD
    fecha_fin: string;            // YYYY-MM-DD
    lectura_anterior: number;
    lectura_actual: number;
    consumo_kwh_total: number;
    precio_kwh: number;
    alumbrado_publico: number;
    monto: number;
    estado: string;
    pago: PagoConsumoItem | null;  // null si el consumo aún no tiene pago registrado
}

export interface NuevoPagoConsumoResponse {
    id: string; // id del nuevo pago
}
