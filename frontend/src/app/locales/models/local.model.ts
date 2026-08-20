export interface LocalRegistrarReq {
    propiedadId: number;
    nombreLocal: string;
    descripcion: string;
    area: number;
}

export interface LocalRegistrarResponse {
    id: number;
    propiedadId: number;
    nombre: string;
    descripcion: string;
    area: number;
}