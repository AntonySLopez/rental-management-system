import { Service, inject } from '@angular/core';
import { GarantiaRepository } from '../repository/repository';
import {
  GestionarGarantiaReq,
  GestionarGarantiaRes,
  GarantiaActivaResponse,
  GarantiaDetalleResponse,
} from '../models/garantia.model';
import { Observable } from 'rxjs';

@Service()
export class GarantiaService {
  private readonly garantiaRepository = inject(GarantiaRepository);

  listaGarantiasRetenidas(): Observable<GarantiaActivaResponse[]> {
    return this.garantiaRepository.listaGarantiasRetenidas();
  }

  obtenerGarantiaDetallada(id: number): Observable<GarantiaDetalleResponse> {
    return this.garantiaRepository.obtenerGarantiaDetallada(id);
  }

  devolverGarantia(req: GestionarGarantiaReq): Observable<GestionarGarantiaRes> {
    return this.garantiaRepository.devolverGarantia(req);
  }

  aplicarGarantia(req: GestionarGarantiaReq): Observable<GestionarGarantiaRes> {
    return this.garantiaRepository.aplicarGarantia(req);
  }
}
