export interface CrearContratoReq {
    inquilinoId: number;
    localId: number;
    precioMensual: number;
    duracionMeses: number;
    fechaInicio: string;
    fechaFin: string;
    observacion?: string;
    lecturaAnterior: number;
    garantia?: number;
}

export interface CrearContratoRes {
    id: number;
}

export interface ContratoActivoResponse {
    id: number;
    propiedad_nombre: string;
    local_nombre: string;
    precio_mensual: number;
}

export interface ContratoDetalleResponse {
    id: number;
    inquilino_id: number;
    local_id: number;
    precio_mensual: number;
    duracion_meses: number;
    fecha_inicio: string;
    fecha_fin: string;
    observacion: string;
    lectura_anterior: number;
    garantia: number;
    estado_id: number;
    inquilino_nombre: string;
    local_nombre: string;
    propiedad_nombre: string;
}

export interface RenovarContratoReq {
    contrato_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    duracion_meses: number;
    observacion?: string;
}

export interface RenovarContratoRes {
    message: string;
}

export interface CerrarContratoReq {
    contrato_id: number;
}

export interface CerrarContratoRes {
    message: string;
}
