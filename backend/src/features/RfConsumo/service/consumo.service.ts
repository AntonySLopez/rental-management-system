import { ConsumoRepository } from "../repository/consumo.repository.js";
import { RD } from "./rule/rd.js";
import { ConsumoLogic } from "./logic/consumo.logic.js";
import type { NuevoConsumoDto } from "../interface/dto/nuevoConsumo.dto.js";
import type { ListarConsumosDto } from "../interface/dto/listarConsumos.dto.js";
import type { DetalleConsumoDto } from "../interface/dto/detalleConsumo.dto.js";
import type { NuevoPagoConsumoDto } from "../interface/dto/nuevoPagoConsumo.dto.js";
import type { 
    NuevoConsumoResponse, 
    ListarConsumosResponse,
    DetalleConsumoResponse,
    NuevoPagoConsumoResponse 
} from "../interface/types/consumo.types.js";

/**
 * Service: ConsumoService
 * Orquesta el flujo de consumo según B8
 */
export class ConsumoService {
    private consumoRepository: ConsumoRepository;
    private RD: RD;
    private consumoLogic: ConsumoLogic;

    constructor() {
        this.consumoRepository = new ConsumoRepository();
        this.RD = new RD();
        this.consumoLogic = new ConsumoLogic(this.consumoRepository);
    }

    /**
     * nuevoConsumo - Caso de uso #21
     * Flujo según B8
     */
    async nuevoConsumo(dto: NuevoConsumoDto): Promise<NuevoConsumoResponse> {
        // RD.nuevoConsumo: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.nuevoConsumo: contratoActivo
        await this.RD.contratoActivo(dto.contrato_id);

        // RD.nuevoConsumo: lecturaAnteriorConsecutiva
        await this.RD.lecturaAnteriorConsecutiva(dto.contrato_id, dto.lectura_anterior);

        // operation24: calcularConsumo + registrarConsumo.repository()
        return await this.consumoLogic.operation24(dto);
    }

    /**
     * listarConsumos - Caso de uso #22
     * Flujo según B8
     */
    async listarConsumos(dto: ListarConsumosDto): Promise<ListarConsumosResponse> {
        // RD.listarConsumos: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // operation25: listarConsumos.repository()
        return await this.consumoLogic.operation25(dto.contrato_id);
    }

    /**
     * detalleConsumo - Caso de uso #23
     * Flujo según B8
     */
    async detalleConsumo(dto: DetalleConsumoDto): Promise<DetalleConsumoResponse> {
        // RD.detalleConsumo: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.detalleConsumo: consumoExiste
        await this.RD.consumoExiste(dto.id, dto.contrato_id);

        // RD.detalleConsumo: consumoNoAnulado
        await this.RD.consumoNoAnulado(dto.id);

        // operation26: obtenerConsumo.repository() + obtenerPagoConsumo.repository()
        return await this.consumoLogic.operation26(dto.id);
    }

    /**
     * nuevoPagoConsumo - Caso de uso #24
     * Flujo según B8
     */
    async nuevoPagoConsumo(dto: NuevoPagoConsumoDto): Promise<NuevoPagoConsumoResponse> {
        // RD.nuevoPagoConsumo: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.nuevoPagoConsumo: contratoActivo
        await this.RD.contratoActivo(dto.contrato_id);

        // RD.nuevoPagoConsumo: consumoExiste
        await this.RD.consumoExiste(dto.id, dto.contrato_id);

        // RD.nuevoPagoConsumo: consumoPagable
        await this.RD.consumoPagable(dto.id);

        // RD.nuevoPagoConsumo: montoIgualAMontoConsumo
        await this.RD.montoIgualAMontoConsumo(dto.id, dto.monto);

        // operation27: registrarPagoConsumo.repository() + actualizarConsumo.repository()
        return await this.consumoLogic.operation27(
            dto.id,
            dto.monto,
            dto.metodo_pago,
            dto.referencia || null,
            dto.observaciones || null
        );
    }
}
