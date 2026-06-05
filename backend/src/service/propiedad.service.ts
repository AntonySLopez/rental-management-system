import { PropiedadRepository } from "../repository/propiedad.repository.js";
import type { RegistrarPropiedadDTO } from "../schema/registrarPropiedadDTO.js";
import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class PropiedadService {
    private propiedadRepository: PropiedadRepository;

    constructor() {
        this.propiedadRepository = new PropiedadRepository();
    }

    async registrarPropiedad(propiedad: RegistrarPropiedadDTO) {
        // validamos que la propiedad no exista
        const propiedadExistente = await this.propiedadRepository.findByNombre(propiedad.nombre);
        if (propiedadExistente) {
            throw new AppError("La propiedad ya existe", 409);
        }
        const result = await this.propiedadRepository.save(propiedad);
        return result;
    }
}