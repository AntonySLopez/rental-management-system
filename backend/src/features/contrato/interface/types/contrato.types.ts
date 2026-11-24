// Tipos del módulo contrato

export interface ContratoInput {
    inquilino_id: number;
    local_id: number;
    precio_mensual: number;
    garantia: number;
    lectura_inicial_luz: number;
    fecha_inicio: string;
    duracion_meses: number;
    observaciones?: string | null;
    metodo_pago: 'efectivo' | 'transferencia' | 'deposito_bancario';
    referencia?: string | null;
}

// DTOs de salida según B7
export interface NuevoContratoResponse {
    id: string;
}

export interface ContratoItem {
    id: string;
    inquilino: string;
    local: string;
    precio_mensual: number;
    fecha_inicio: string;
    duracion_meses: number;
    estado: string;
}

export interface ListarContratosResponse {
    data: ContratoItem[];
    total: number;
    page: number;
    limit: number;
}

export interface InquilinoResumen {
    id: string;
    nombre: string;
    documento: string;
}

export interface LocalResumen {
    id: string;
    nombre: string;
    area: number;
}

export interface DeudaResumen {
    total_cuotas_adeudadas: number;
    total_consumos_pendientes: number;
    total_deuda: number;
}

export interface DetalleContratoResponse {
    id: string;
    inquilino: InquilinoResumen;
    local: LocalResumen;
    precio_mensual: number;
    garantia: number;
    lectura_inicial_luz: number;
    fecha_creacion: string;
    fecha_inicio: string;
    duracion_meses: number;
    observaciones: string | null;
    estado: string;
    deuda: DeudaResumen;
}

export interface ActualizarContratoResponse {
    id: string;
}

export interface CerrarContratoResponse {
    success: boolean;
    message: string;
}

export interface RenovarContratoResponse {
    id: string;
}
