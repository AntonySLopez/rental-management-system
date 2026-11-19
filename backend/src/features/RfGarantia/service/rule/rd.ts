import { AppError } from "../../../../shared/appError.js";
import { RDRepository } from "../../repository/rd.repository.js";
import { GarantiaRepository } from "../../repository/garantia.repository.js";

/**
 * RD - Reglas de Dominio
 * Clase que agrupa todas las reglas de dominio para garantías
 */
export class RD {
    private rdRepository: RDRepository;
    private garantiaRepository: GarantiaRepository;

    constructor() {
        this.rdRepository = new RDRepository();
        this.garantiaRepository = new GarantiaRepository();
    }

    async contratoExiste(id: number): Promise<boolean> {
        const existe = await this.rdRepository.contratoExiste(id);
            
        if (!existe) {
            throw new AppError("El contrato no existe", 404);
        }
            
        return true;
    }

    async contratoTieneGarantia(contratoId: number): Promise<boolean> {
        const tieneGarantia = await this.rdRepository.contratoTieneGarantia(contratoId);
            
        if (!tieneGarantia) {
            throw new AppError("El contrato no tiene una garantía registrada", 400);
        }
            
        return true;
    }

    async garantiaRetenida(contratoId: number): Promise<boolean> {
        const retenida = await this.rdRepository.garantiaRetenida(contratoId);
            
        if (!retenida) {
            throw new AppError("La garantía del contrato no está retenida", 400);
        }
            
        return true;
    }

    async montoNoSuperaSaldoGarantia(contratoId: number, monto: number): Promise<boolean> {
        const garantia = await this.garantiaRepository.obtenerGarantia(contratoId);
        const movimientos = await this.garantiaRepository.obtenerMovimientoGarantia(garantia.id);
        const saldoActual = Number(garantia.monto) + movimientos;
            console.log("saldo", saldoActual);
            
        if (monto > saldoActual) {
            throw new AppError("El monto supera el saldo disponible de la garantía", 400);
        }
            
        return true;
    }
}
