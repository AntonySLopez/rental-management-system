import { Service, inject } from '@angular/core';
import { Repository } from '../repository/repository';
import { Observable } from 'rxjs';
import { LuzModel } from '../models/luz.model';

@Service()
export class LuzService {
  private repository = inject(Repository);

  findAllLocales(): Observable<any[]> {
    return this.repository.findAllLocales();
  }

  buscarContratoPorLocalId(localId: number): Observable<any> {
    return this.repository.buscarContratoPorLocalId(localId);
  }

  registrarConsumo(consumo: LuzModel): Observable<any> {
    return this.repository.registrarConsumo(consumo);
  }
}
