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