import { InquilinoRepository } from "../../repository/inquilino.repository.js";
import type { InquilinoInput } from "../../interface/types/inquilino.types.js";
import type { ListarInquilinosResponse } from "../../interface/dto/listarInquilinos.dto.js";
import type { DetalleInquilinoResponse } from "../../interface/dto/detalleInquilino.dto.js";
import type { ActualizarInquilinoResponse } from "../../interface/dto/actualizarInquilino.dto.js";

/**
 * InquilinoLogic
 * Clase que agrupa todas las operaciones de lógica de negocio para inquilinos
 */
export class InquilinoLogic {
    private inquilinoRepository: InquilinoRepository;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
    }

    /**
     * operation1 - registrarInquilino
     * Lógica concreta para registrar inquilino
     * registrarInquilino.repository()
     */
    async operation1(inquilino: InquilinoInput): Promise<string> {
        const result = await this.inquilinoRepository.registrarInquilino(inquilino);
        return result.id.toString();
    }

    /**
     * operation2 - listarInquilinos
     * Lógica concreta para listar inquilinos
     * listarInquilinos.repository()
     */
    async operation2(page: number, limit: number): Promise<ListarInquilinosResponse> {
        const result = await this.inquilinoRepository.listarInquilinos(page, limit);
        
        return {
            data: result.data.map(row => ({
                id: row.id.toString(),
                nombre: row.nombre,
                telefono: row.telefono,
                documento: row.documento,
                estado: row.estado
            })),
            total: result.total,
            page: result.page,
            limit: result.limit
        };
    }

    /**
     * operation3 - detalleInquilino
     * Lógica concreta para obtener detalle de inquilino
     * obtenerInquilinoById.repository()
     */
    async operation3(id: number): Promise<DetalleInquilinoResponse> {
        const inquilino = await this.inquilinoRepository.obtenerInquilinoById(id);
        
        if (!inquilino) {
            throw new Error("Inquilino no encontrado");
        }
        
        return {
            id: inquilino.id.toString(),
            nombre: inquilino.nombre,
            telefono: inquilino.telefono,
            email: inquilino.email,
            documento: inquilino.documento,
            fecha_registro: inquilino.fecha_registro.toISOString(),
            estado: inquilino.estado
        };
    }

    /**
     * operation4 - actualizarInquilino
     * Lógica concreta para actualizar inquilino
     * editarInquilino.repository()
     */
    async operation4(id: number, data: any): Promise<ActualizarInquilinoResponse> {
        const result = await this.inquilinoRepository.editarInquilino(id, data);
        return { id: result.id.toString() };
    }
}
