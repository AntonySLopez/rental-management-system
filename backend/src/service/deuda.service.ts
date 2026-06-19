import { ContratoRepository } from "../repository/contrato.repository.js";
import { CuotaAlquilerRepository } from "../repository/cuotaAlquiler.repository.js";
import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import type { ConsultarDeudaDTO } from "../schema/consultarDeudaDTO.js";
import type { DeudaAlquiler, DeudaConsumoLuz } from "../types/deuda.types.js";

import { AppError } from "../middleWare/flujo/appError.middleware.js";
import type { PoolClient } from "pg";

export class DeudaService {
    private contratoRepository: ContratoRepository;
    private cuotaAlquilerRepository: CuotaAlquilerRepository;
    private consumoLuzRepository: ConsumoLuzRepository;

    constructor() {
        this.contratoRepository = new ContratoRepository();
        this.cuotaAlquilerRepository = new CuotaAlquilerRepository();
        this.consumoLuzRepository = new ConsumoLuzRepository();
    }

    async consultarDeuda(deuda: ConsultarDeudaDTO, cliente?: PoolClient) {
        // validar que contrato exista
        await this.validarContratoExistente(deuda.contratoId, cliente);
        console.log("contrato valido");
        
        //obtener deuda de alquiler
        const deudaAlquiler = await this.obtenerDeudaAlquiler(deuda.contratoId, cliente);
        console.log("deuda de alquiler obtenida");
        //obtener deuda de consumo luz
        const deudaConsumoLuz = await this.obtenerDeudaConsumoLuz(deuda.contratoId, cliente);
        console.log("deuda de consumo luz obtenida");
        //resumir deudas
        const deudas = this.resumirDeudas(deudaAlquiler, deudaConsumoLuz);
        console.log("deudas resumidas");
        //retornar resultado
        return deudas;
        }

    private async validarContratoExistente(contratoId: number, cliente?: PoolClient) {
        const contratoExistente = await this.contratoRepository.findById(contratoId, cliente);
        if (!contratoExistente) {
            throw new AppError("El contrato no existe", 404);
        }
        if (contratoExistente.estado !== "activo") {
            throw new AppError("El contrato no está activo", 400);
        }
        return contratoExistente;
    }

    private async obtenerDeudaAlquiler(contratoId: number, cliente?: PoolClient) {
        const deuda = await this.cuotaAlquilerRepository.findAllByContratoId(contratoId, cliente);
        // filtramos pagos e incluye los que 
        return deuda;
    }

    private async obtenerDeudaConsumoLuz(contratoId: number, cliente?: PoolClient) {
        const deuda = await this.consumoLuzRepository.findAllByContratoId(contratoId, cliente);
        return deuda;
    }

    private async resumirDeudas(deudaAlquiler: DeudaAlquiler[], deudaConsumoLuz: DeudaConsumoLuz[]) {
        const deudaTotalAlquiler: number = deudaAlquiler.reduce((acc, deuda) => acc + Number(deuda.monto), 0) - deudaAlquiler.reduce((acc, deuda) => acc + Number(deuda.monto_pagado), 0);
        const deudaTotalConsumoLuz: number = deudaConsumoLuz.reduce((acc, deuda) => acc + Number(deuda.monto), 0) - deudaConsumoLuz.reduce((acc, deuda) => acc + Number(deuda.monto_pagado), 0);

        const resultado = {
            total:{
                alquiler: deudaTotalAlquiler,
                consumoLuz: deudaTotalConsumoLuz,
                general: deudaTotalAlquiler + deudaTotalConsumoLuz
            },
            detallado:{
                alquiler: deudaAlquiler,
                consumoLuz: deudaConsumoLuz
            }
        };
        console.log("resultado", resultado);
        return resultado;
    }
}
