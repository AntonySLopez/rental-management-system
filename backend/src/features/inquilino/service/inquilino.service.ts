import { InquilinoRepository } from "../repository/inquilino.repository.js";
import { ruleDomain } from "./rule/rd.js";
import { InquilinoLogic } from "./logic/inquilino.logic.js";
import type { NuevoInquilinoDto } from "../interface/dto/registrarInquilino.dto.js";
import type { NuevoInquilinoResponse } from "../interface/dto/registrarInquilino.dto.js";
import type { ListarInquilinosDto } from "../interface/dto/listarInquilinos.dto.js";
import type { ListarInquilinosResponse } from "../interface/dto/listarInquilinos.dto.js";
import type { DetalleInquilinoDto } from "../interface/dto/detalleInquilino.dto.js";
import type { DetalleInquilinoResponse } from "../interface/dto/detalleInquilino.dto.js";
import type { ActualizarInquilinoDto } from "../interface/dto/actualizarInquilino.dto.js";
import type { ActualizarInquilinoResponse } from "../interface/dto/actualizarInquilino.dto.js";

/**
 * Service: InquilinoService
 * Orquesta el flujo de registro, listado, detalle y actualización de inquilinos según B8
 */
export class InquilinoService {
    private inquilinoRepository: InquilinoRepository;
    private RD: ruleDomain;
    private logic: InquilinoLogic;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
        this.RD = new ruleDomain;
        this.logic = new InquilinoLogic();
    }

    /**
     * registrarInquilino - Caso de uso principal
     * Flujo según B8
     */
    async registrarInquilino(inquilino: NuevoInquilinoDto): Promise<NuevoInquilinoResponse> {
        // RD.registrarInquilino: documentoUnico
        await this.RD.registrarInquilino(inquilino.documento);

        // Convertir undefined a null para campos opcionales
        const inquilinoInput = {
            nombre: inquilino.nombre,
            telefono: inquilino.telefono ?? null,
            email: inquilino.email ?? null,
            documento: inquilino.documento,
        };

        // operation1: registrarInquilino.repository()
        const id = await this.logic.operation1(inquilinoInput);

        // respuesta: retorna el id del nuevo inquilino
        return { id };
    }

    /**
     * listarInquilinos - Caso de uso #2
     * Flujo según B8
     */
    async listarInquilinos(dto: ListarInquilinosDto): Promise<ListarInquilinosResponse> {
        // operation2: listarInquilinos.repository()
        return await this.logic.operation2(dto.page, dto.limit);
    }

    /**
     * detalleInquilino - Caso de uso #3
     * Flujo según B8
     */
    async detalleInquilino(dto: DetalleInquilinoDto): Promise<DetalleInquilinoResponse> {
        // RD.detalleInquilino: detalleInquilino
        await this.RD.detalleInquilino(dto.id);

        // operation3: obtenerInquilinoById.repository()
        return await this.logic.operation3(dto.id);
    }

    /**
     * actualizarInquilino - Caso de uso #4
     * Flujo según B8
     */
    async actualizarInquilino(dto: ActualizarInquilinoDto): Promise<ActualizarInquilinoResponse> {
        // RD.actualizarInquilino: inquilinoExiste
        await this.RD.actualizarInquilino(dto.id, dto.documento);

        // Preparar datos para actualizar (solo campos opcionales)
        const updateData: any = {};
        if (dto.nombre !== undefined) updateData.nombre = dto.nombre;
        if (dto.telefono !== undefined) updateData.telefono = dto.telefono ?? null;
        if (dto.email !== undefined) updateData.email = dto.email ?? null;
        updateData.documento = dto.documento;

        // operation4: editarInquilino.repository()
        return await this.logic.operation4(dto.id, updateData);
    }
}
