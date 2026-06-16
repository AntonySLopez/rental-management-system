import { ContratoRepository } from "../repository/contrato.repository.js";
import { InquilinoRepository } from "../repository/inquilino.repository.js";
import { CuotaAlquilerRepository } from "../repository/cuotaAlquiler.repository.js";
import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import { GarantiaRepository } from "../repository/garantia.repository.js";

import type { CrearContratoDTO } from "../schema/crearContratoDTO.js";
import type { Cuota } from "../types/cuota.types.js";
import type { Luz } from "../types/luz.types.js";
import type { Garantia } from "../types/garantia.types.js";

import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class ContratoService {
    private inquilinoRepository: InquilinoRepository;
    private contratoRepository: ContratoRepository;
    private cuotaAlquilerRepository: CuotaAlquilerRepository;
    private consumoLuzRepository: ConsumoLuzRepository;
    private garantiaRepository: GarantiaRepository;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
        this.contratoRepository = new ContratoRepository();
        this.cuotaAlquilerRepository = new CuotaAlquilerRepository();
        this.consumoLuzRepository = new ConsumoLuzRepository();
        this.garantiaRepository = new GarantiaRepository();
    }
    
    async crearContrato(contrato: CrearContratoDTO) {

        const cliente: PoolClient = await pool.connect();
        console.log("hilo de conexion obtenido");
        
        try {
            // iniciamos transaccion
            await cliente.query('BEGIN');
     
            const inquilinoExistente = await this.inquilinoRepository.findById(contrato.inquilinoId, cliente);
            if (!inquilinoExistente) {
                throw new AppError("El inquilino no existe", 404);
            }
            const contratoExistente = await this.contratoRepository.validarLocalDisponible(contrato.localId, cliente);
            if (contratoExistente) {
                throw new AppError("El local no está disponible", 409);
            }
            console.log("local disponible");
            
            //guardamos el contrato y obtenemos el id
            const contratoSaveResult = await this.contratoRepository.save(contrato, cliente);
            console.log("contrato guardado con id", contratoSaveResult);
            
            //creamos estructura de cuotas
            const cuotaAlquiler: Cuota = {
                contrato_id: contratoSaveResult,
                fecha_inicio: new Date(contrato.fechaInicio),
                fecha_fin: new Date(contrato.fechaFin),
                monto: contrato.precioMensual,
            };
    
            // creamos cuotas de alquiler segun cantidad de meses
            await this.cuotaAlquilerRepository.saveAllCuotasForContrato(cuotaAlquiler, contrato.duracionMeses, cliente);
            console.log("cuotas creadas");

            // creamos primer registro de consumo de luz
            const primerResgistro: Luz = {
                contrato_id: contratoSaveResult,
                fecha_inicio: new Date(contrato.fechaInicio),
                fecha_fin: new Date(contrato.fechaFin),
                lectura_anterior: 0,
                lectura_actual: contrato.lecturaAnterior,
                precio_kwh: 0,
                alumbrado_publico: 0,
                consumo_total: 0,
            };
            await this.consumoLuzRepository.saveFirstConsumoLuz(primerResgistro, cliente);
            console.log("primer consumo de luz creado");

            // si hay garantia, creamos la garantia
            if (contrato.garantia) {
                // creamos garantia
                console.log("creando garantia");
                const garantia: Garantia = {
                    contrato_id: contratoSaveResult,
                    monto: contrato.garantia!,
                    fecha_registro: new Date(contrato.fechaInicio),
                };
                await this.garantiaRepository.saveGarantia(garantia, cliente);
                console.log("garantia creada");
            };
            // confirmamos transaccion
            await cliente.query('COMMIT'); 

            console.log("id de contrato creado:", contratoSaveResult);
            return contratoSaveResult;

        } catch (error) {
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            // liberamos cliente
            cliente.release();
            console.log("hilo de conexion liberado");
        }
    }
}

