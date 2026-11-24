// Tipos del módulo local

export interface LocalInput {
    nombre: string;
    descripcion?: string | null;
    area: number;
}

// DTOs de salida según B7
export interface NuevoLocalResponse {
    id: string;
}

export interface LocalItem {
    id: string;
    nombre: string;
    area: number;
    estado: string;
}

export interface ListarLocalesResponse {
    data: LocalItem[];
    total: number;
    page: number;
    limit: number;
}

export interface DetalleLocalResponse {
    id: string;
    nombre: string;
    descripcion: string | null;
    area: number;
    estado: string;
}

export interface ActualizarLocalResponse {
    id: string;
}
