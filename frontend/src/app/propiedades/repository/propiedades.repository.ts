import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { registrarPropiedadModel } from '../models/propiedad.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Service()
export class PropiedadesRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  //metodo post a /propiedad/registrar
  registrarPropiedad(datos: registrarPropiedadModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/propiedad/registrar`, datos);
  }
}
