import { AlquilerRepository } from "../repository/alquiler.repository.js";
import { RDRepository } from "../repository/rd.repository.js";
import { RD } from "./rule/rd.js";
import { AlquilerLogic } from "./logic/alquiler.logic.js";
import type { ListarCuotasDto } from "../interface/dto/listarCuotas.dto.js";
import type { ListarCuotasResponse } from "../interface/types/alquiler.types.js";
import type { DetalleCuotaDto } from "../interface/dto/detalleCuota.dto.js";
import type { PagoAlquilerResponse } from "../interface/types/alquiler.types.js";
import type { NuevoPagoAlquilerDto } from "../interface/dto/nuevoPagoAlquiler.dto.js";
import type { NuevoPagoAlquilerResponse } from "../interface/types/alquiler.types.js";

/**
 * Service: AlquilerService
 * Orquesta el flujo de listar cuotas según B8
 */
export class AlquilerService {
    private alquilerRepository: AlquilerRepository;
    private rdRepository: RDRepository;
    private RD: RD;
    private alquilerLogic: AlquilerLogic;

    constructor() {
        this.alquilerRepository = new AlquilerRepository();
        this.rdRepository = new RDRepository();
        this.RD = new RD();
        this.alquilerLogic = new AlquilerLogic(this.alquilerRepository);
    }

    /**
     * listarCuotas - Caso de uso #18
     * Flujo según B8
     */
    async listarCuotas(dto: ListarCuotasDto): Promise<ListarCuotasResponse> {
        // RD.listarCuotas: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // operation21: listarCuotas.repository()
        return await this.alquilerLogic.operation21(dto.contrato_id);
    }

    /**
     * detalleCuota - Caso de uso #19
     * Flujo según B8
     */
    async detalleCuota(dto: DetalleCuotaDto): Promise<PagoAlquilerResponse> {
        // RD.detalleCuota: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.detalleCuota: cuotaExiste
        await this.RD.cuotaExiste(dto.cuota_id, dto.contrato_id);

        // RD.detalleCuota: cuotaNoAnulada
        await this.RD.cuotaNoAnulada(dto.cuota_id);

        // operation22: obtenerPagoAlquiler.repository()
        return await this.alquilerLogic.operation22(dto.cuota_id);
    }

    /**
     * nuevoPagoAlquiler - Caso de uso #20
     * Flujo según B8
     */
    async nuevoPagoAlquiler(dto: NuevoPagoAlquilerDto): Promise<NuevoPagoAlquilerResponse> {
        // RD.nuevoPagoAlquiler: contratoExiste
        await this.RD.contratoExiste(dto.contrato_id);

        // RD.nuevoPagoAlquiler: contratoActivo
        await this.RD.contratoActivo(dto.contrato_id);

        // RD.nuevoPagoAlquiler: cuotaExiste
        await this.RD.cuotaExiste(dto.cuota_id, dto.contrato_id);

        // RD.nuevoPagoAlquiler: cuotaPagable
        await this.RD.cuotaPagable(dto.cuota_id);

        // RD.nuevoPagoAlquiler: montoIgualAMontoCuota
        await this.RD.montoIgualAMontoCuota(dto.cuota_id, dto.monto);

        // rd.cuotaSiguiente
        await this.RD.cuotaSiguiente(dto.contrato_id, dto.cuota_id);

        // operation23: registrarPagoAlquiler.repository() + actualizarCuota.repository()
        return await this.alquilerLogic.operation23(
            dto.cuota_id,
            dto.monto,
            dto.metodo_pago,
            dto.referencia || null,
            dto.observaciones || null
        );
    }
}
