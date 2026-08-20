import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Service()
export class PropiedadRepository {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    
        // obtener propiedades
    listaPropiedades(): Observable<PropiedadListaResponse[]> {
        return this.http.get<PropiedadListaResponse[]>(`${this.apiUrl}/propiedad/lista`);
    }
}
