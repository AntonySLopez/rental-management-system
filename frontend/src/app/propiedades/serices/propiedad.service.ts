import { Service, inject } from '@angular/core';
import { PropiedadesRepository } from '../repository/propiedades.repository';
import { registrarPropiedadModel } from '../models/propiedad.model';

@Service()
export class PropiedadService {
  private propiedadesRepository = inject(PropiedadesRepository);
  
  registrarPropiedad(datos: registrarPropiedadModel) {
    return this.propiedadesRepository.registrarPropiedad(datos);
  }
}
