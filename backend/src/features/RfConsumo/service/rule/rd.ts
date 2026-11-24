import { AppError } from "../../../../shared/appError.js";
import { RDRepository } from "../../repository/rd.repository.js";

/**
 * RD - Reglas de Dominio para Consumo
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

    async consumoExiste(consumoId: number, contratoId: number): Promise<boolean> {
        const existe = await this.rdRepository.consumoExiste(consumoId, contratoId);
        if (!existe) {
            throw new AppError("El consumo no existe o no pertenece al contrato", 404);
        }
        return true;
    }

    async consumoNoAnulado(consumoId: number): Promise<boolean> {
        const noAnulado = await this.rdRepository.consumoNoAnulado(consumoId);
        if (!noAnulado) {
            throw new AppError("El consumo está anulado", 400);
        }
        return true;
    }

    async consumoPagable(consumoId: number): Promise<boolean> {
        const pagable = await this.rdRepository.consumoPagable(consumoId);
        if (!pagable) {
            throw new AppError("El consumo no está en estado pagable", 400);
        }
        return true;
    }

    async montoIgualAMontoConsumo(consumoId: number, monto: number): Promise<boolean> {
        const igual = await this.rdRepository.montoIgualAMontoConsumo(consumoId, monto);
        if (!igual) {
            throw new AppError("El monto no coincide con el monto del consumo", 400);
        }
        return true;
    }

    async lecturaAnteriorConsecutiva(contratoId: number, lecturaAnterior: number): Promise<boolean> {
        const ultimoConsumo = await this.rdRepository.obtenerUltimoConsumo(contratoId);

        let lecturaEsperada: number;
        if (ultimoConsumo !== null) {
            lecturaEsperada = ultimoConsumo.lectura_actual;
        } else {
            const contrato = await this.rdRepository.obtenerLecturaInicialContrato(contratoId);
            if (!contrato) {
                throw new AppError("El contrato no existe", 404);
            }
            lecturaEsperada = contrato.lectura_inicial_luz;
        }

        if (Number(lecturaAnterior.toFixed(2)) !== Number(lecturaEsperada.toFixed(2))) {
            throw new AppError(
                `La lectura anterior (${lecturaAnterior}) no es consecutiva. Se esperaba ${lecturaEsperada}`,
                400
            );
        }

        return true;
    }
}
