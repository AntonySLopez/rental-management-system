import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class Repository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  findAllLocales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/local/todos`);
  }

  buscarContratoPorLocalId(localId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/luz/detalle/${localId}`);
  }

  registrarConsumo(consumo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/luz/registrar/consumo`, consumo);
  }
}
