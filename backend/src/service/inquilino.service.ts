import { InquilinoRepository } from "../repository/inquilino.repository.js";
import type { RegistrarInquilinoDTO } from "../application/registrarInquilinoDTO.js";

import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class InquilinoService {
    private inquilinoRepository: InquilinoRepository;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
    }

    async registrarInquilino(inquilino: RegistrarInquilinoDTO) {
        // validamos que el inquilino no exista
        const inquilinoExistente = await this.inquilinoRepository.findByDocumento(inquilino.documento);
        if (inquilinoExistente) {
            throw new AppError("El inquilino ya existe", 409);
        }
        const result = await this.inquilinoRepository.save(inquilino);
        return result;
    }
}
