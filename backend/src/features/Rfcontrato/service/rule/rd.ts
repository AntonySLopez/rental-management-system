import { AppError } from "../../../../shared/appError.js";
import { RDRepository } from "../../repository/rd.repository.js";

/**
 * RD - Reglas de Dominio consolidadas
 * Clase que contiene todas las reglas según B8
 */
export class RD {
    constructor(private rdRepository: RDRepository) {}

    async inquilinoExiste(id: number): Promise<boolean> {
        const existe = await this.rdRepository.inquilinoExiste(id);
        
        if (!existe) {
            throw new AppError("El inquilino no existe", 404);
        }
            
        return true;
    }

    async inquilinoActivo(id: number): Promise<boolean> {
        const activo = await this.rdRepository.inquilinoActivo(id);
            
        if (!activo) {
            throw new AppError("El inquilino no está activo", 400);
        }
            
        return true;
    }

    async localExiste(id: number): Promise<boolean> {
        const existe = await this.rdRepository.localExiste(id);
            
        if (!existe) {
            throw new AppError("El local no existe", 404);
        }
            
        return true;
    }

    async localLibre(id: number): Promise<boolean> {
        const libre = await this.rdRepository.localLibre(id);
            
        if (!libre) {
            throw new AppError("El local no está disponible (no está libre)", 400);
        }
            
        return true;
    }

    async contratoExiste(id: number): Promise<boolean> {
        const existe = await this.rdRepository.contratoExiste(id);
            
        if (!existe) {
            throw new AppError("El contrato no existe", 404);
        }
            
        return true;
    }

    async contratoVigente(id: number): Promise<boolean> {
        const vigente = await this.rdRepository.contratoVigente(id);
            
        if (!vigente) {
            throw new AppError("El contrato no está vigente (no está activo o renovado)", 400);
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

    async contratoSinDeuda(contratoId: number): Promise<boolean> {
        const sinDeuda = await this.rdRepository.contratoSinDeuda(contratoId);
            
        if (!sinDeuda) {
            throw new AppError("El contrato tiene deuda pendiente (cuotas o consumos)", 400);
        }
            
        return true;
    }

    async fechaInicioValido(contratoId: number, fechaInicio: string): Promise<boolean> {
        const valido = await this.rdRepository.fechaInicioValido(contratoId, fechaInicio);
            
        if (!valido) {
            throw new AppError("La fecha de inicio no es válida (debe ser posterior a la última cuota pagada)", 400);
        }
            
        return true;
    }
};
