import { InquilinoRepository } from "../features/inquilinos/repository/inquilino.repository.js";
import type { RegistrarInquilinoDTO } from "../features/inquilinos/interface/schema/registrarInquilinoDTO.js";

import { AppError } from "../shared/appError.js";

export class InquilinoService {
    private inquilinoRepository: InquilinoRepository;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
    }
    // registrar inquilino
    async registrarInquilino(inquilino: RegistrarInquilinoDTO) {
        // validamos que el inquilino no exista
        const inquilinoExistente = await this.inquilinoRepository.findByDocumento(inquilino.documento);
        if (inquilinoExistente) {
            throw new AppError("El inquilino ya existe", 409);
        }
        const result = await this.inquilinoRepository.save(inquilino);
        return result;
    }
    // obtener lista de inquilinos
    async listaInquilinos() {
        const result = await this.inquilinoRepository.listaInquilinos();
        return result;
    }
}
