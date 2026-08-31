import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ContratoActivoResponse, RegistrarPagoReq, RegistrarPagoRes } from '../models/pago.model';
import { Observable } from 'rxjs';

@Service()
export class PagoRepository {
  private readonly http = inject(HttpClient);

  listaContratosActivos(): Observable<ContratoActivoResponse[]> {
    return this.http.get<ContratoActivoResponse[]>(`${environment.apiUrl}/contrato/activos`);
  }

  registrarPago(pago: RegistrarPagoReq): Observable<RegistrarPagoRes> {
    return this.http.post<RegistrarPagoRes>(`${environment.apiUrl}/pago/registrar`, pago);
  }
}
