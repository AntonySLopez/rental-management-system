export interface PagoModel {}

export interface ContratoActivoResponse {
  id: number;
  inquilino_nombre: string;
  propiedad_nombre: string;
  local_nombre: string;
  precio_mensual: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface ContratoDetalleResponse {
  id: number;
  inquilino_id: number;
  inquilino_nombre: string;
  local_id: number;
  local_nombre: string;
  propiedad_nombre: string;
  precio_mensual: string;
  duracion_meses: number;
  fecha_inicio: string;
  fecha_fin: string;
  observacion: string | null;
  estado: string;
}

export interface RegistrarPagoReq {
  contratoId: number;
  monto: number;
  metodoPago: string;
  referencia?: string;
  descripcion?: string;
}

export interface RegistrarPagoRes {
  message: string;
}
