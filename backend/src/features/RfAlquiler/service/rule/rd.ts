import { AppError } from "../../../../shared/appError.js";
import { RDRepository } from "../../repository/rd.repository.js";

/**
 * RD - Reglas de Dominio
 * Clase que agrupa todas las reglas de dominio para alquiler
 */
export class RD {
    private rdRepository: RDRepository;

    constructor() {
        this.rdRepository = new RDRepository();
    }

    async contratoExiste(id: number): Promise<boolean> {
        const existe = await this.rdRepository.contratoExiste(id);
            
        if (!existe) {
            throw new AppError("El contrato no existe", 404);
        }
            
        return true;
    }

    async contratoActivo(id: number): Promise<boolean> {
        const activo = await this.rdRepository.contratoActivo(id);
            
        if (!activo) {
            throw new AppError("El contrato no está activo", 400);
        }
            
        return true;
    }

    async cuotaExiste(cuotaId: number, contratoId: number): Promise<boolean> {
        const existe = await this.rdRepository.cuotaExiste(cuotaId, contratoId);
            
        if (!existe) {
            throw new AppError("La cuota no existe o no pertenece al contrato", 404);
        }
            
        return true;
    }

    async cuotaNoAnulada(cuotaId: number): Promise<boolean> {
        const noAnulada = await this.rdRepository.cuotaNoAnulada(cuotaId);
            
        if (!noAnulada) {
            throw new AppError("La cuota está anulada", 400);
        }
            
        return true;
    }

    async cuotaPagable(cuotaId: number): Promise<boolean> {
        const pagable = await this.rdRepository.cuotaPagable(cuotaId);
            
        if (!pagable) {
            throw new AppError("La cuota no está en estado pagable", 400);
        }
            
        return true;
    }

    async montoIgualAMontoCuota(cuotaId: number, monto: number): Promise<boolean> {
        const igual = await this.rdRepository.montoIgualAMontoCuota(cuotaId, monto);
            
        if (!igual) {
            throw new AppError("El monto no coincide con el monto de la cuota", 400);
        }
            
        return true;
    }

    async cuotaSiguiente(contratoId: number, cuotaId: number): Promise<boolean> {
        const siguiente = await this.rdRepository.cuotaSiguiente(contratoId);

        if (siguiente !== cuotaId && siguiente !== null) {
            throw new AppError("La cuota no es la siguiente para el contrato", 400);
        }

        return true;
    }    
}  
