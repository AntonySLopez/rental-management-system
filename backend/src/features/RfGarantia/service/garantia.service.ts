import { GarantiaRepository } from "../repository/garantia.repository.js";
import { RD } from "./rule/rd.js";
import { GarantiaLogic } from "./logic/garantia.logic.js";
import type { DetalleGarantiaDto } from "../interface/dto/detalleGarantia.dto.js";
import type { DetalleGarantiaResponse } from "../interface/types/garantia.types.js";
import type { ListarMovimientosGarantiaDto } from "../interface/dto/listarMovimientosGarantia.dto.js";
import type { ListarMovimientosGarantiaResponse } from "../interface/types/garantia.types.js";
import type { NuevoMovimientoGarantiaDto } from "../interface/dto/nuevoMovimientoGarantia.dto.js";
import type { NuevoMovimientoGarantiaResponse } from "../interface/types/garantia.types.js";

/**
 * Service: GarantiaService
 * Orquesta el flujo de detalle de garantía según B8
 */
export class GarantiaService {
    private garantiaRepository: GarantiaRepository;
    private RD: RD;
    private garantiaLogic: GarantiaLogic;

    constructor() {
        this.garantiaRepository = new GarantiaRepository();
        this.RD = new RD();
        this.garantiaLogic = new GarantiaLogic(this.garantiaRepository);
    }

    /**
     * detalleGarantia - Caso de uso #15
     * Flujo según B8
     */
    async detalleGarantia(dto: DetalleGarantiaDto): Promise<DetalleGarantiaResponse> {
        // RD.detalleGarantia: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.detalleGarantia: contratoTieneGarantia
        await this.RD.contratoTieneGarantia(dto.contrato_id);

        // operation16: obtenerGarantia.repository() + obtenerMovimientoGarantia.repository() + obtenerSaldoGarantia.repository()
        return await this.garantiaLogic.operation16(dto.contrato_id);
    }

    /**
     * listarMovimientosGarantia - Caso de uso #16
     * Flujo según B8
     */
    async listarMovimientosGarantia(dto: ListarMovimientosGarantiaDto): Promise<ListarMovimientosGarantiaResponse> {
        // RD.listarMovimientosGarantia: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.listarMovimientosGarantia: contratoTieneGarantia
        await this.RD.contratoTieneGarantia(dto.contrato_id);

        // operation18: listarMovimientos.repository()
        return await this.garantiaLogic.operation18(dto.contrato_id, dto.page, dto.limit);
    }

    /**
     * nuevoMovimientoGarantia - Caso de uso #17
     * Flujo según B8
     */
    async nuevoMovimientoGarantia(dto: NuevoMovimientoGarantiaDto): Promise<NuevoMovimientoGarantiaResponse> {
        // RD.nuevoMovimientoGarantia: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.nuevoMovimientoGarantia: contratoTieneGarantia
        await this.RD.contratoTieneGarantia(dto.contrato_id);

        // RD.nuevoMovimientoGarantia: garantiaRetenida
        await this.RD.garantiaRetenida(dto.contrato_id);

        // RD.nuevoMovimientoGarantia: montoNoSuperaSaldoGarantia
        await this.RD.montoNoSuperaSaldoGarantia(dto.contrato_id, dto.monto);

        // operation19: obtenerGarantia.repository() + registrarMovimientoGarantia.repository()
        const garantiaId = await this.garantiaLogic.operation19(
            dto.contrato_id,
            dto.monto,
            dto.metodo_pago,
            dto.referencia || 'sin referencia',
            dto.tipo_accion,
            dto.observaciones || 'sin observaciones'
        );

        return { id: garantiaId.toString() };
    }
}
