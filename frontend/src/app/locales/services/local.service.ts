import { Service, inject } from '@angular/core';
import { LocalRepository } from '../repository/local.repository';
import { LocalRegistrarReq } from '../models/local.model';

@Service()
export class LocalServices {
    private localRepository = inject(LocalRepository);
    
    // registra nuevo local
    registrarLocal(datos: LocalRegistrarReq) {
        return this.localRepository.registrarLocal(datos);
    }
    
    // obtiene lista de locales
    listaDeLocales() {
        return this.localRepository.listaPropiedades();
    }
}
