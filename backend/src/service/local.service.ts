import type { RegistrarLocalDTO } from "../schema/registrarLocalDTO.js";
import { LocalRepository } from "../repository/local.repository.js";
import { PropiedadRepository } from "../repository/propiedad.repository.js";

import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class LocalService {
    private localRepository: LocalRepository;
    private propiedadRepository: PropiedadRepository;

    constructor() {
        this.localRepository = new LocalRepository();
        this.propiedadRepository = new PropiedadRepository();
    }

    async registrarLocal(local: RegistrarLocalDTO) {
        // validamos que la propiedad exista
        const propiedadExistente = await this.propiedadRepository.findById(local.propiedadId);
        if (!propiedadExistente) {
            throw new AppError("La propiedad no existe", 404);
        }
        // validamos que el local no exista
        const localExistente = await this.localRepository.findByNombre(local.nombreLocal, local.propiedadId);
        if (localExistente) {
            throw new AppError("El local ya existe", 409);
        }
        const result = await this.localRepository.save(local);
        return result;
    }
}