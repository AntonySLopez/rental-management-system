import type { RegistrarLocalDTO } from "../schema/registrarLocalDTO.js";
import { LocalRepository } from "../repository/local.repository.js";
import type { Local, LocalCompleto } from "../types/local.types.js";
import { PropiedadRepository } from "../repository/propiedad.repository.js";

import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class LocalService {
    private localRepository: LocalRepository;
    private propiedadRepository: PropiedadRepository;

    constructor() {
        this.localRepository = new LocalRepository();
        this.propiedadRepository = new PropiedadRepository();
    }
    // registra local
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
    // obtiene lista de locales
    async listaLocales(propiedadId: number) {
        const result = await this.localRepository.listaLocales(propiedadId);
        return result;
    }
    // obtiene lista de todos los locales
    async findAllLocales(): Promise<LocalCompleto[]> {
        const result = await this.localRepository.findAllLocales();
        return result;
    }
}
