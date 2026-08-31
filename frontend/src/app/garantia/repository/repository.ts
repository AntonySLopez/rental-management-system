import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
  GestionarGarantiaReq,
  GestionarGarantiaRes,
  GarantiaActivaResponse,
  GarantiaDetalleResponse,
} from '../models/garantia.model';
import { Observable } from 'rxjs';

@Service()
export class GarantiaRepository {
  private readonly http = inject(HttpClient);

  listaGarantiasRetenidas(): Observable<GarantiaActivaResponse[]> {
    return this.http.get<GarantiaActivaResponse[]>(
      `${environment.apiUrl}/garantia/retenidas`
    );
  }

  obtenerGarantiaDetallada(id: number): Observable<GarantiaDetalleResponse> {
    return this.http.get<GarantiaDetalleResponse>(
      `${environment.apiUrl}/garantia/detallada/${id}`
    );
  }

  devolverGarantia(req: GestionarGarantiaReq): Observable<GestionarGarantiaRes> {
    return this.http.post<GestionarGarantiaRes>(
      `${environment.apiUrl}/garantia/devolver`,
      req
    );
  }

  aplicarGarantia(req: GestionarGarantiaReq): Observable<GestionarGarantiaRes> {
    return this.http.post<GestionarGarantiaRes>(
      `${environment.apiUrl}/garantia/aplicar`,
      req
    );
  }
}
