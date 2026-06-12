import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import { ContratoRepository } from "../repository/contrato.repository.js";
import type { Luz } from "../types/luz.types.js";
import type { RegistrarConsumoLuzDTO } from "../schema/registrarConsumoLuzDTO.js";

import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class ConsumoLuzService {

    private consumoLuzRepository: ConsumoLuzRepository;
    private contratoRepository: ContratoRepository;

    constructor() {
        this.consumoLuzRepository = new ConsumoLuzRepository();
        this.contratoRepository = new ContratoRepository();
    }

    async registrarConsumoLuz(consumo: RegistrarConsumoLuzDTO) {
        // validamos que el contrato exista
        await this.validarContratoExistente(consumo.contratoId);
        // obtenemos el ultimo consumo registrado
        const ultimoRegistro = await this.validarUltimoConsumoRegistrado(consumo.contratoId);
        
        // caculo de resumen de consumo
        const resumen : Luz = this.calcularResumen(
            ultimoRegistro.lectura_actual, ultimoRegistro.fecha_fin, consumo);
        
        // guarda el consumo de luz
        const consumoRegistrado = await this.guardarConsumoLuz(resumen);
        
        return consumoRegistrado;
    }

    //valida contrato existente
    private async validarContratoExistente(contratoId: number) {
        const contratoExistente = await this.contratoRepository.findById(contratoId);
        if (!contratoExistente || contratoExistente.estado !== "activo") {
            throw new AppError("El contrato no existe o no está activo", 404);
        }
    }
    //valida ultimo consumo registrado
    private async validarUltimoConsumoRegistrado(contratoId: number) {
        const result: { lectura_actual: number; fecha_fin: Date } = await this.consumoLuzRepository.findLastByContratoId(contratoId);
        if (!result) {
            throw new AppError("No se encontró el último consumo registrado", 404);
        }
        console.log("ultimo registro encontrado", result);
        return result;
    }
    // calcula el resumen del consumo
    private calcularResumen(ultimoConsumo: number, fechaFin: Date, consumo: RegistrarConsumoLuzDTO): Luz {
        // valida que lectura actual sea mayor a la anterior
        if (consumo.lecturaActual <= ultimoConsumo) {
            throw new AppError("La lectura actual debe ser mayor a la anterior", 400);
        }
        // nueva fecha fin
        const diaFin = fechaFin.getDate();
        const newFechaFin = new Date();
        newFechaFin.setMonth(newFechaFin.getMonth() + 1);
        newFechaFin.setDate(diaFin);


        return {
        contrato_id: consumo.contratoId,
        fecha_inicio: new Date(),
        fecha_fin: newFechaFin,
        lectura_anterior: ultimoConsumo,
        lectura_actual: consumo.lecturaActual,
        precio_kwh: consumo.precioKwh,
        alumbrado_publico: consumo.alumbradoPublico,
        consumo_total: consumo.lecturaActual - ultimoConsumo,
        monto: (consumo.lecturaActual - ultimoConsumo) * consumo.precioKwh + consumo.alumbradoPublico
    }
    }
    // guardar consumo de luz
    private async guardarConsumoLuz(consumo: Luz) {
        const registro = await this.consumoLuzRepository.saveConsumo(consumo);
        console.log("nueva fila creada id:", registro.id);
        return registro
    }
}
