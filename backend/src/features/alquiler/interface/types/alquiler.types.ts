// Tipos de respuesta según B7

export interface CuotaItem {
  id: string;
  fecha_inicio: string;       // YYYY-MM-DD
  fecha_vencimiento: string;  // YYYY-MM-DD
  monto: number;
  estado: string;
}

export interface ListarCuotasResponse {
  data: CuotaItem[];
}

export interface PagoAlquilerResponse {
  id: string;
  monto: number;
  metodo_pago: string;
  referencia: string | null;
  fecha_registro: string;       // ISO 8601
  observaciones: string | null;
}

export interface NuevoPagoAlquilerResponse {
  id: string;  // id del nuevo pago
}
