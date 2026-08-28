import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CrearContratoReq, CrearContratoRes } from '../models/contrato.model';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { InquilinoListaResponse } from '../models/inquilino.model';
import { LocalListaResponse } from '../models/local-lista.model';
import { Observable } from 'rxjs';

@Service()
export class ContratoRepository {
  private readonly http = inject(HttpClient);
  
  crearContrato(contrato: CrearContratoReq): Observable<CrearContratoRes> {
    return this.http.post<CrearContratoRes>(`${environment.apiUrl}/contrato/crear`, contrato);
  }

  listaPropiedades(): Observable<PropiedadListaResponse[]> {
    return this.http.get<PropiedadListaResponse[]>(`${environment.apiUrl}/propiedad/lista`);
  }

  listaInquilinos(): Observable<InquilinoListaResponse[]> {
    return this.http.get<InquilinoListaResponse[]>(`${environment.apiUrl}/inquilino/lista`);
  }

  listaLocales(propiedadId: number): Observable<LocalListaResponse[]> {
    return this.http.get<LocalListaResponse[]>(`${environment.apiUrl}/local/lista/${propiedadId}`);
  }
}
