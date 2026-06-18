import { ContratoRepository } from "../repository/contrato.repository.js";
import { InquilinoRepository } from "../repository/inquilino.repository.js";
import { CuotaAlquilerRepository } from "../repository/cuotaAlquiler.repository.js";
import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import { GarantiaRepository } from "../repository/garantia.repository.js";
import { LocalRepository } from "../repository/local.repository.js";

import type { CrearContratoDTO } from "../schema/crearContratoDTO.js";
import type { RenovarContratoDTO } from "../schema/renovarContratoDTO.js";
import type { ConsultarDeudaDTO } from "../schema/consultarDeudaDTO.js";
import type { Cuota } from "../types/cuota.types.js";
import type { Luz } from "../types/luz.types.js";
import type { Garantia } from "../types/garantia.types.js";
import type { Contrato } from "../types/contrato.types.js";

import { DeudaService } from "./deuda.service.js";

import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class ContratoService {
    private inquilinoRepository: InquilinoRepository;
    private contratoRepository: ContratoRepository;
    private cuotaAlquilerRepository: CuotaAlquilerRepository;
    private consumoLuzRepository: ConsumoLuzRepository;
    private garantiaRepository: GarantiaRepository;
    private localRepository: LocalRepository;
    private deudaService: DeudaService;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
        this.contratoRepository = new ContratoRepository();
        this.cuotaAlquilerRepository = new CuotaAlquilerRepository();
        this.consumoLuzRepository = new ConsumoLuzRepository();
        this.garantiaRepository = new GarantiaRepository();
        this.localRepository = new LocalRepository();
        this.deudaService = new DeudaService();
    }
    
    // crear contrato
    async crearContrato(contrato: CrearContratoDTO, client?: PoolClient) {

        const isExternalClient = !!client;
        const cliente: PoolClient = client ?? await pool.connect();
        console.log("hilo de conexion obtenido");
        
        try {
            // iniciamos transaccion
            if (!isExternalClient) {
                await cliente.query('BEGIN');
            }
            
            const inquilinoExistente = await this.inquilinoRepository.findById(contrato.inquilinoId, cliente);
            if (!inquilinoExistente) {
                throw new AppError("El inquilino no existe", 404);
            }
            const localDisponible = await this.localRepository.findById(contrato.localId, cliente);
            if (localDisponible.contrato_id) {
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
            if (!isExternalClient) {
                await cliente.query('COMMIT'); 
            }

            console.log("id de contrato creado:", contratoSaveResult);
            return contratoSaveResult;

        } catch (error) {
            if (!isExternalClient) {
                await cliente.query('ROLLBACK');
            }
            throw error;
        } finally {
            // liberamos cliente
            if (!isExternalClient) {
                cliente.release();
                console.log("hilo de conexion liberado");
            }
        }
    }

    // cerrar contrato
    async cerrarContrato(contratoId: number) {
        
            // validamos contrato
            await this.validarContrato(contratoId);
            console.log("contrato valido");
            
            // cerramos contrato
            await this.cerrar(contratoId);
            console.log("contrato cerrado");
    }

    // renovar contrato
    async renovarContrato(renovar: RenovarContratoDTO) {
        
        // obtenemos cliente
        const cliente = await pool.connect();
        
        try {
            // iniciamos transaccion
            await cliente.query('BEGIN');
            // validamos que exista el contrato
            const contrato = await this.validarContrato(renovar.contrato_id, cliente);
            console.log("contrato valido", contrato);
            
            // R. C.U. consultar deuda
            await this.validarDeuda(renovar.contrato_id, cliente);
            console.log("deuda validada");
            
            // R. C.U. actualizar contrato a renovado
            await this.actualizarContratoRenovado(renovar.contrato_id, cliente);
            console.log("contrato actualizado a renovado");
            
            // R. C.U. gestion de garantia : devuelta
            const garantia = await this.renovarGarantia(renovar.contrato_id, cliente);
            console.log(garantia);
            
            // crea nuevo objeto contrato
            const nuevoContrato : CrearContratoDTO = await this.crearObjetoContrato(contrato, renovar, garantia, cliente);
            console.log("nuevo contrato creado", nuevoContrato);

            // R. C.U. crear contrato nuevo
            const nuevoContratoId = await this.crearContratoNuevo(nuevoContrato, cliente);
            console.log("contrato nuevo creado con id:", nuevoContratoId);

            await cliente.query('COMMIT');
            return nuevoContratoId;
        } catch (error) {
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            // liberamos cliente
            cliente.release();
            console.log("hilo de conexion liberado");
        }
    }

    // validar contrato
    private async validarContrato(contratoId: number, cliente?: PoolClient) {
        const contrato = await this.contratoRepository.findById(contratoId, cliente);
        if (!contrato) {
            throw new AppError("Contrato no encontrado", 404);
        }                
        return contrato;
    }

    // cierra contrato
    private async cerrar(contratoId: number, cliente?: PoolClient) {
        await this.contratoRepository.close(contratoId, cliente);
    }
//
    // consultar y validar deuda
    private async validarDeuda(contratoId: number, cliente?: PoolClient) {
        const id: ConsultarDeudaDTO = { contratoId };
        const deuda = await this.deudaService.consultarDeuda(id);
        if (deuda.total.general > 0) {
            throw new AppError("El contrato tiene deuda pendiente", 409);
        }
    }

    // actualizar contrato a renovado
    private async actualizarContratoRenovado(contratoId: number, cliente?: PoolClient) {
        await this.contratoRepository.renovar(contratoId, cliente);
    }
//    
    // renovar garantia
    private async renovarGarantia(contratoId: number, cliente?: PoolClient) {
        const garantia = await this.garantiaRepository.findByContratoId(contratoId, cliente);
        if (!garantia) {
            console.log("No se encontro garantia para el contrato");
            return "No se encontro garantia para el contrato";
        }
        await this.garantiaRepository.updateEstadoByContratoId(contratoId, {
            fecha_movimiento: new Date(),
            observaciones: "Garantia devuelta",
            estado_id: "devuelta",
            movimiento_id: 2
        });
        return garantia.monto;
    }

    // crear nuevo objeto de contrato
    private async crearObjetoContrato(oldContrato: Contrato, renovar:RenovarContratoDTO, garantia: number, cliente: PoolClient) {

        const ultimaLectura = await this.consumoLuzRepository.findLastByContratoId(renovar.contrato_id, cliente);

        const nuevoContratoObj : CrearContratoDTO = {
            inquilinoId: oldContrato.inquilino_id,
            localId: oldContrato.local_id,
            precioMensual: oldContrato.precio_mensual,
            duracionMeses: renovar.duracion_meses,
            lecturaAnterior: ultimaLectura.lectura_actual,
            fechaInicio: renovar.fecha_inicio,
            fechaFin: renovar.fecha_fin,
            observacion: "Contrato renovado",
            garantia: garantia
        };
        return nuevoContratoObj;
    }
    // crear contrato nuevo
    private async crearContratoNuevo(nuevoContrato: CrearContratoDTO, cliente: PoolClient) {
        
        const contrato = await this.crearContrato(nuevoContrato, cliente);
        return contrato;
    }

}
