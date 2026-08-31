export interface GarantiaModel {}

export interface GarantiaActivaResponse {
  contrato_id: number;
  propiedad_nombre: string;
  local_nombre: string;
  garantia_id: number;
  garantia: number;
}

export interface GarantiaDetalleResponse {
  contrato_id: number;
  inquilino_nombre: string;
  propiedad_nombre: string;
  local_nombre: string;
  garantia_id: number;
  garantia: number;
  fecha_registro: string;
  observaciones: string | null;
  estado: string;
}

export interface GestionarGarantiaReq {
  contrato_id: number;
  tipo_operacion: string;
}

export interface GestionarGarantiaRes {
  message: string;
}
