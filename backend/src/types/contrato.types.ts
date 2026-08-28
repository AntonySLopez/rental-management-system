export type Contrato = {
    id: number;
    inquilino_id: number;
    local_id: number;
    precio_mensual: number;
    duracion_meses: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    observacion: string;
    lectura_anterior: number;
    garantia: number;

};

export type ContratoActivo = {
    id: number;
    propiedad_nombre: string;
    local_nombre: string;
    precio_mensual: number;
}

export type ContratoDetalle = {
    id: number;
    inquilino_id: number;
    local_id: number;
    precio_mensual: number;
    duracion_meses: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    observacion: string;
    lectura_anterior: number;
    garantia: number;
    estado_id: number;
    inquilino_nombre: string;
    local_nombre: string;
    propiedad_nombre: string;
}