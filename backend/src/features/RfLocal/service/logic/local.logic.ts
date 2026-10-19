import { LocalRepository } from "../../repository/local.repository.js";
import type { LocalInput } from "../../interface/types/local.types.js";
import { SharedRepository } from "../../../../shared/countItems.js";
import type { NuevoLocalResponse } from "../../interface/types/local.types.js";
import type { ListarLocalesResponse, LocalItem } from "../../interface/types/local.types.js";
import type { DetalleLocalResponse } from "../../interface/types/local.types.js";
import type { ActualizarLocalResponse } from "../../interface/types/local.types.js";

/**
 * LocalLogic
 * Clase que agrupa todas las operaciones de lógica de negocio para locales
 */
export class LocalLogic {
    private localRepository: LocalRepository;
    private shared: SharedRepository;

    constructor(localRepository: LocalRepository) {
        this.localRepository = localRepository;
        this.shared = new SharedRepository();
    }

    /**
     * operation5 - registrarLocal
     * Lógica concreta para registrar local
     * guardarLocal.repository()
     */
    async operation5(local: LocalInput): Promise<NuevoLocalResponse> {
        const id = await this.localRepository.guardarLocal(local);
        return { id };
    }

    /**
     * operation6 - listarLocales
     * Lógica concreta para listar locales
     * listarLocales.repository()
     */
    async operation6(page: number, limit: number): Promise<ListarLocalesResponse> {
        const result = await this.localRepository.listarLocales(page, limit);
        const total = await this.shared.contarRegistros('local');
        
        const items = result.data.map((row: LocalItem) => ({
            id: row.id.toString(),
            nombre: row.nombre,
            area: row.area,
            estado: row.estado
        }));

        return {
            data: items,
            total,
            page,
            limit
        };
    }

    /**
     * operation7 - detalleLocal
     * Lógica concreta para obtener detalle de local
     * obtenerLocalById.repository()
     */
    async operation7(id: number): Promise<DetalleLocalResponse> {
        const result = await this.localRepository.obtenerLocalById(id);
        
        if (!result) {
            throw new Error('Local no encontrado');
        }
        return {
            id: result.id.toString(),
            nombre: result.nombre,
            descripcion: result.descripcion,
            area: result.area,
            estado: result.estado
        };
    }

    /**
     * operation8 - actualizarLocal
     * Lógica concreta para actualizar local
     * actualizarLocalById.repository()
     */
    async operation8(id: number, data: any): Promise<ActualizarLocalResponse> {
        const resultId = await this.localRepository.actualizarLocalById(id, data);
        return { id: resultId };
    }
}
