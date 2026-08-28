import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalRegistrarReq, LocalRegistrarResponse } from '../models/local.model';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Service()
export class LocalRepository {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // registrar local
    registrarLocal(local: LocalRegistrarReq): Observable<LocalRegistrarResponse> {
        return this.http.post<LocalRegistrarResponse>(`${this.apiUrl}/local/registrar`, local);
    }

        listaPropiedades(): Observable<PropiedadListaResponse[]> {
        return this.http.get<PropiedadListaResponse[]>(`${this.apiUrl}/propiedad/lista`);
    }
}
