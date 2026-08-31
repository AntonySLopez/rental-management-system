import { Service, inject } from '@angular/core';
import { PagoRepository } from '../repository/repository';
import { ContratoActivoResponse, RegistrarPagoReq, RegistrarPagoRes } from '../models/pago.model';
import { Observable } from 'rxjs';

@Service()
export class PagoService {
  private pagoRepository = inject(PagoRepository);

  getListaDeContratosActivos(): Observable<ContratoActivoResponse[]> {
    return this.pagoRepository.listaContratosActivos();
  }

  registrarPago(pago: RegistrarPagoReq): Observable<RegistrarPagoRes> {
    return this.pagoRepository.registrarPago(pago);
  }
}
