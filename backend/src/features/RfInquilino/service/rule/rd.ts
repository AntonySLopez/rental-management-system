import { AppError } from "../../../../shared/appError.js";
import { RdRepository } from "../../repository/rd.repository.js";

/**
 * RD - Reglas de Dominio consolidadas
 * Clase que ejecuta reglas de dominio usando el repository
 */
export class ruleDomain {
    private rdRepository: RdRepository;

    constructor() {
        this.rdRepository = new RdRepository();
    }

    /**
     * RD.registrarInquilino.documentoUnico
     * Valida que el documento no exista en otro inquilino
     */
    async registrarInquilino(documento: string): Promise<boolean> {
        const inquilinoExistente = await this.rdRepository.documentoUnico(documento);
        
        if (inquilinoExistente) {
            throw new AppError("El documento ya está registrado", 409);
        }
        
        return true;
    }

    /**
     * RD.detalleInquilino.detalleInquilino
     * Valida que el inquilino exista
     */
    async detalleInquilino(id: number): Promise<boolean> {
        const existe = await this.rdRepository.inquilinoExiste(id);
        
        if (!existe) {
            throw new AppError("El inquilino no existe", 404);
        }
        
        return true;
    }

    /**
     * RD.actualizarInquilino.inquilinoExiste
     * Valida que el inquilino exista
     */
    async actualizarInquilino(id: number, documento: string): Promise<boolean> {
        const inquilino: { id: number; documento: string } | null = await this.rdRepository.inquilinoExiste(id);
        
        // validar que el inquilino exista
        if (!inquilino) {
            throw new AppError("El inquilino no existe", 404);
        }
        
        // validar que el documento sea diferente al actual
        if(inquilino.documento === documento) {
            throw new AppError("El documento es el mismo que el actual", 409);
        }

        if (inquilino.id != id) {
            throw new AppError("El documento ya está registrado en otro inquilino", 409);
        }
        return true;
    }
}
