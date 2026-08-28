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
