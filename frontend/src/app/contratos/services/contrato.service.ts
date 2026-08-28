import { Service, inject } from '@angular/core';
import { ContratoRepository } from '../repository/contrato.repository';
import { CrearContratoReq, CrearContratoRes, ContratoActivoResponse, ContratoDetalleResponse, RenovarContratoReq, RenovarContratoRes } from '../models/contrato.model';
import { Observable } from 'rxjs';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { InquilinoListaResponse } from '../models/inquilino.model';
import { LocalListaResponse } from '../models/local-lista.model';
@Service()
export class ContratoService {
  private contratoRepository = inject(ContratoRepository);
  
  crearContrato(contrato: CrearContratoReq): Observable<CrearContratoRes> {
    return this.contratoRepository.crearContrato(contrato);
  }

  getListaDePropiedades(): Observable<PropiedadListaResponse[]> {
    return this.contratoRepository.listaPropiedades();
  }

  getListaDeInquilinos(): Observable<InquilinoListaResponse[]> {
    return this.contratoRepository.listaInquilinos();
  }

  getListaDeLocales(propiedadId: number): Observable<LocalListaResponse[]> {
    return this.contratoRepository.listaLocales(propiedadId);
  }

  getListaDeContratosActivos(): Observable<ContratoActivoResponse[]> {
    return this.contratoRepository.listaContratosActivos();
  }

  buscarContratoPorId(id: number): Observable<ContratoDetalleResponse> {
    return this.contratoRepository.buscarContratoPorId(id);
  }

  renovarContrato(contrato: RenovarContratoReq): Observable<RenovarContratoRes> {
    return this.contratoRepository.renovarContrato(contrato);
  }
}
