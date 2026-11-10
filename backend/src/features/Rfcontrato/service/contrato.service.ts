import { ContratoRepository } from "../repository/contrato.repository.js";
import { RDRepository } from "../repository/rd.repository.js";
import { RD } from "./rule/rd.js";
import { ContratoLogic } from "./logic/contrato.logic.js";
import type { NuevoContratoDto } from "../interface/dto/nuevoContrato.dto.js";
import type { NuevoContratoResponse } from "../interface/types/contrato.types.js";
import type { ContratoInput } from "../interface/types/contrato.types.js";
import type { ListarContratosDto } from "../interface/dto/listarContratos.dto.js";
import type { ListarContratosResponse } from "../interface/types/contrato.types.js";
import type { DetalleContratoDto } from "../interface/dto/detalleContrato.dto.js";
import type { DetalleContratoResponse } from "../interface/types/contrato.types.js";
import type { ActualizarContratoDto } from "../interface/dto/actualizarContrato.dto.js";
import type { ActualizarContratoResponse } from "../interface/types/contrato.types.js";
import type { CerrarContratoDto } from "../interface/dto/cerrarContrato.dto.js";
import type { CerrarContratoResponse } from "../interface/types/contrato.types.js";
import type { RenovarContratoDto } from "../interface/dto/renovarContrato.dto.js";
import type { RenovarContratoResponse } from "../interface/types/contrato.types.js";

/**
 * Service: ContratoService
 * Orquesta el flujo de creación de contrato según B8
 */
export class ContratoService {
    private contratoRepository: ContratoRepository;
    private rdRepository: RDRepository;
    private RD: RD;
    private contratoLogic: ContratoLogic;

    constructor() {
        this.contratoRepository = new ContratoRepository();
        this.rdRepository = new RDRepository();
        this.RD = new RD(this.rdRepository);
        this.contratoLogic = new ContratoLogic(this.contratoRepository);
    }

    /**
     * nuevoContrato - Caso de uso #9
     * Flujo según B8
     */
    async nuevoContrato(contrato: NuevoContratoDto): Promise<NuevoContratoResponse> {
        // RD.nuevoContrato: inquilinoExiste
        await this.RD.inquilinoExiste(contrato.inquilino_id);
        console.log('inquilinoExiste passed');
        // RD.nuevoContrato: inquilinoActivo
        await this.RD.inquilinoActivo(contrato.inquilino_id);
        console.log('inquilinoActivo passed');

        // RD.nuevoContrato: localExiste
        await this.RD.localExiste(contrato.local_id);
        console.log('localExiste passed');

        // RD.nuevoContrato: localLibre
        await this.RD.localLibre(contrato.local_id);

        // Convertir undefined a null para campos opcionales
        const contratoInput: ContratoInput = {
            inquilino_id: contrato.inquilino_id,
            local_id: contrato.local_id,
            precio_mensual: contrato.precio_mensual,
            garantia: contrato.garantia ?? 0,
            lectura_inicial_luz: contrato.lectura_inicial_luz ?? 0,
            fecha_inicio: contrato.fecha_inicio,
            duracion_meses: contrato.duracion_meses,
            observaciones: contrato.observaciones ?? null,
            metodo_pago: contrato.metodo_pago,
            referencia: contrato.referencia ?? null,
        };

        // operation9: registrarContrato.repository() + operaciones relacionadas
        return await this.contratoLogic.operation9(contratoInput);
    }
    /**
     * listarContratos - Caso de uso #10
     * Flujo según B8
     */
    async listarContratos(dto: ListarContratosDto): Promise<ListarContratosResponse> {
        // operation10: listarContratos.repository()
        return await this.contratoLogic.operation10(dto.page, dto.limit);
    }

    /**
     * detalleContrato - Caso de uso #11
     * Flujo según B8
     */
    async detalleContrato(dto: DetalleContratoDto): Promise<DetalleContratoResponse> {
        // RD.detalleContrato: contratoExiste
        await this.RD.contratoExiste(dto.id);
        
        // operation11
        return await this.contratoLogic.operation11(dto.id);
    }

    /**
     * actualizarContrato - Caso de uso #12
     * Flujo según B8
     */
    async actualizarContrato(id: number, dto: ActualizarContratoDto): Promise<ActualizarContratoResponse> {
        // RD.actualizarContrato: contratoExiste (siempre)
        await this.RD.contratoExiste(id);

        // RD.actualizarContrato: contratoVigente (siempre)
        await this.RD.contratoVigente(id);

        // RD.actualizarContrato: localExiste
        await this.RD.localExiste(dto.local_id);
        
        // RD.actualizarContrato: localLibre
        await this.RD.localLibre(dto.local_id);
        
        // operation13: actualizarContratoLocal.repository() + actualizarEstadoLocal.repository()
        await this.contratoLogic.operation13(id, dto.local_id, dto.observaciones);
        
        return { id: id.toString() };
    }

    /**
     * cerrarContrato - Caso de uso #13
     * Flujo según B8
     */
    async cerrarContrato(dto: CerrarContratoDto): Promise<CerrarContratoResponse> {
        // RD.cerrarContrato: contratoExiste
        await this.RD.contratoExiste(dto.id);

        // RD.cerrarContrato: contratoVigente
        await this.RD.contratoVigente(dto.id);

        // operation14: cerrarContrato.repository() + liberarEstadoLocal.repository()
        return await this.contratoLogic.operation14(dto.id);
    }

    /**
     * renovarContrato - Caso de uso #14
     * Flujo según B8
     */
    async renovarContrato(id: number, dto: RenovarContratoDto): Promise<RenovarContratoResponse> {
        // RD.renovarContrato: contratoExiste
        await this.RD.contratoExiste(id);

        // RD.renovarContrato: contratoActivo
        await this.RD.contratoActivo(id);

        // RD.renovarContrato: contratoSinDeuda
        await this.RD.contratoSinDeuda(id);

        // RD.renovarContrato: fechaInicioValido
        // await this.RD.fechaInicioValido(id, dto.fecha_inicio);

        // operation15: transacción de renovación
        return await this.contratoLogic.operation15(id, dto.fecha_inicio, dto.precio_mensual, dto.observaciones);
    }
}

