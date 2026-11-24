import { LocalRepository } from "../repository/local.repository.js";
import { RDRepository } from "../repository/rd.repository.js";
import { RD } from "./rule/rd.js";
import { LocalLogic } from "./logic/local.logic.js";
import type { NuevoLocalDto } from "../interface/dto/registrarLocal.dto.js";
import type { NuevoLocalResponse } from "../interface/types/local.types.js";
import type { ListarLocalesDto } from "../interface/dto/listarLocales.dto.js";
import type { ListarLocalesResponse } from "../interface/types/local.types.js";
import type { DetalleLocalDto } from "../interface/dto/detalleLocal.dto.js";
import type { DetalleLocalResponse } from "../interface/types/local.types.js";
import type { ActualizarLocalDto } from "../interface/dto/actualizarLocal.dto.js";
import type { ActualizarLocalResponse } from "../interface/types/local.types.js";

/**
 * Service: LocalService
 * Orquesta el flujo de registro de local según B8
 */
export class LocalService {
    private localRepository: LocalRepository;
    private rdRepository: RDRepository;
    private RD: RD;
    private logic: LocalLogic;

    constructor() {
        this.localRepository = new LocalRepository();
        this.rdRepository = new RDRepository();
        this.RD = new RD(this.rdRepository);
        this.logic = new LocalLogic(this.localRepository);
    }

    /**
     * registrarLocal - Caso de uso #5
     * Flujo según B8
     */
    async registrarLocal(dto: NuevoLocalDto): Promise<NuevoLocalResponse> {
        // RD.registrarnuevoLocal: nombreLocalUnico
        await this.RD.registrarnuevoLocal.nombreLocalUnico(dto.nombre);

        // Convertir undefined a null para campos opcionales
        const localInput: any = {
            nombre: dto.nombre,
            descripcion: dto.descripcion ?? null,
            area: dto.area,
        };

        // operation5: guardarLocal.repository()
        return await this.logic.operation5(localInput);
    }

    /**
     * listarLocales - Caso de uso #6
     * Flujo según B8
     */
    async listarLocales(dto: ListarLocalesDto): Promise<ListarLocalesResponse> {
        // operation6: listarLocales.repository()
        return await this.logic.operation6(dto.page, dto.limit);
    }

    /**
     * detalleLocal - Caso de uso #7
     * Flujo según B8
     */
    async detalleLocal(dto: DetalleLocalDto): Promise<DetalleLocalResponse> {
        // RD.detalleLocal: localExiste
        await this.RD.detalleLocal.localExiste(dto.id);

        // operation7: obtenerLocalById.repository()
        return await this.logic.operation7(dto.id);
    }

    /**
     * actualizarLocal - Caso de uso #8
     * Flujo según B8
     */
    async actualizarLocal(dto: ActualizarLocalDto): Promise<ActualizarLocalResponse> {
        // RD.actualizarLocal: localExiste
        await this.RD.actualizarLocal.localExiste(dto.id);

        // RD.actualizarLocal: nombreLocalUnico
        await this.RD.actualizarLocal.nombreLocalUnico(dto.id, dto.nombre);

        // Preparar datos para actualizar (solo campos opcionales)
        const updateData: any = {
            nombre: dto.nombre
        };
        if (dto.descripcion !== undefined) updateData.descripcion = dto.descripcion ?? null;
        if (dto.area !== undefined) updateData.area = dto.area;

        // operation8: actualizarLocalById.repository()
        return await this.logic.operation8(dto.id, updateData);
    }
}
