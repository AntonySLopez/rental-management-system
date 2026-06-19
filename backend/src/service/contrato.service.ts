import { ContratoRepository } from "../repository/contrato.repository.js";
import { InquilinoRepository } from "../repository/inquilino.repository.js";
import { CuotaAlquilerRepository } from "../repository/cuotaAlquiler.repository.js";
import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import { GarantiaRepository } from "../repository/garantia.repository.js";
import { LocalRepository } from "../repository/local.repository.js";
import { movimientoRepository } from "../repository/movimiento.repository.js";

import type { CrearContratoDTO } from "../schema/crearContratoDTO.js";
import type { RenovarContratoDTO } from "../schema/renovarContratoDTO.js";
import type { ConsultarDeudaDTO } from "../schema/consultarDeudaDTO.js";
import type { Cuota } from "../types/cuota.types.js";
import type { Luz } from "../types/luz.types.js";
import type { Garantia } from "../types/garantia.types.js";
import type { Contrato } from "../types/contrato.types.js";
import type { Movimiento } from "../types/movimiento.types.js";

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
    private movimientoRepository: any;

    constructor() {
        this.inquilinoRepository = new InquilinoRepository();
        this.contratoRepository = new ContratoRepository();
        this.cuotaAlquilerRepository = new CuotaAlquilerRepository();
        this.consumoLuzRepository = new ConsumoLuzRepository();
        this.garantiaRepository = new GarantiaRepository();
        this.localRepository = new LocalRepository();
        this.deudaService = new DeudaService();
        this.movimientoRepository = new movimientoRepository();
    }
    
    // crear contrato
    async crearContrato(contrato: CrearContratoDTO, client?: PoolClient, isRenovacion: boolean = false) {

        const isExternalClient = !!client;
        const cliente: PoolClient = client ?? await pool.connect();
        console.log("hilo de conexion obtenido");
        
        try {
            // iniciamos transaccion
            if (!isExternalClient) {
                await cliente.query('BEGIN');
            }
            
            // validar local disponible (solo si no es renovacion)
            if (!isRenovacion) {
                await this.validarLocalDisponible(contrato.localId, cliente);
                console.log("local disponible");
            }
            
            // validar inquilino existente
            await this.validarInquilinoExistente(contrato.inquilinoId, cliente);
            console.log("inquilino validado");
            
            // guardar contrato
            const contratoId = await this.contratoRepository.save(contrato, cliente);
            console.log("contrato guardado con id", contratoId);

            // R. C.U. actualizar local a ocupado con id de contrato
            await this.actualizarLocalOcupado(contrato.localId, contratoId, cliente);
            console.log("local actualizado a ocupado");
            
            // crear cuotas de alquiler
            await this.crearCuotasAlquiler(contratoId, contrato, cliente);
            console.log("cuotas creadas");

            // crear primer consumo de luz
            await this.crearPrimerConsumoLuz(contratoId, contrato, cliente);
            console.log("primer consumo de luz creado");

            // crear garantia si existe
            if (contrato.garantia) {
                await this.crearGarantia(contratoId, contrato.garantia, contrato.fechaInicio, cliente);
                console.log("garantia creada");
            };
            
            // confirmamos transaccion
            if (!isExternalClient) {
                await cliente.query('COMMIT'); 
            }

            console.log("id de contrato creado:", contratoId);
            return contratoId;

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
            console.log("transaccion iniciada");
            
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
    //-----------------------------***-----------------------------------//

    // validar contrato
    private async validarContrato(contratoId: number, cliente?: PoolClient) {
        const contrato = await this.contratoRepository.findById(contratoId, cliente);
        if (!contrato) {
            throw new AppError("Contrato no encontrado", 404);
        }
        if (contrato.estado !== 'activo') {
            throw new AppError("El contrato no está activo", 409);
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
    // libera local
    private async liberarLocal(localId: number, cliente?: PoolClient) {
        await this.localRepository.liberar(localId, cliente);
    }
    // actualizar contrato a renovado
    private async actualizarContratoRenovado(contratoId: number, cliente?: PoolClient) {
        await this.contratoRepository.renovar(contratoId, cliente);
    }
//    
    // renovar garantia
    private async renovarGarantia(contratoId: number, cliente?: PoolClient): Promise<number> {
        const garantia = await this.garantiaRepository.findByContratoId(contratoId, cliente);
        if (!garantia) {
            console.log("No se encontro garantia para el contrato");
            return 0;
        }
        
        // Crear movimiento de devolución de garantía
        const movimiento: Movimiento = {
            contrato_id: contratoId,
            fecha: new Date(),
            monto: garantia.monto,
            metodo_pago: "devolucion_garantia",
            referencia: "Devolución de garantía por renovación",
            descripcion: "Garantia devuelta"
        };
        const movimientoGuardado = await this.movimientoRepository.saveMovimiento(movimiento, cliente);
        
        await this.garantiaRepository.updateEstadoByContratoId(contratoId, {
            fecha_movimiento: new Date(),
            observaciones: "Garantia devuelta",
            estado_id: "devuelta",
            movimiento_id: movimientoGuardado.id
        });
        return garantia.monto;
    }

    // crear nuevo objeto de contrato
    private async crearObjetoContrato(oldContrato: Contrato, renovar:RenovarContratoDTO, garantia: number, cliente: PoolClient) {

        const ultimaLectura = await this.consumoLuzRepository.findLastByContratoId(renovar.contrato_id, cliente);
        
        if (!ultimaLectura) {
            throw new AppError("No se encontró lectura anterior para el contrato", 404);
        }

        const nuevoContratoObj : CrearContratoDTO = {
            inquilinoId: oldContrato.inquilino_id,
            localId: oldContrato.local_id,
            precioMensual: oldContrato.precio_mensual,
            duracionMeses: renovar.duracion_meses,
            lecturaAnterior: ultimaLectura.lectura_actual,
            fechaInicio: renovar.fecha_inicio,
            fechaFin: renovar.fecha_fin,
            observacion: "Contrato renovado",
            garantia: garantia > 0 ? garantia : undefined
        };
        return nuevoContratoObj;
    }
    // crear contrato nuevo
    private async crearContratoNuevo(nuevoContrato: CrearContratoDTO, cliente: PoolClient) {
        
        const contrato = await this.crearContrato(nuevoContrato, cliente, true);
        return contrato;
    }

    //-----------------------------***-----------------------------------//

    // validar inquilino existente
    private async validarInquilinoExistente(inquilinoId: number, cliente: PoolClient) {
        const inquilinoExistente = await this.inquilinoRepository.findById(inquilinoId, cliente);
        if (!inquilinoExistente) {
            throw new AppError("El inquilino no existe", 404);
        }
    }

    // validar local disponible
    private async validarLocalDisponible(localId: number, cliente: PoolClient) {
        const localDisponible = await this.localRepository.findById(localId, cliente);
        if (localDisponible.contrato_id) {
            throw new AppError("El local no está disponible", 409);
        }
    }

    // crear cuotas de alquiler
    private async crearCuotasAlquiler(contratoId: number, contrato: CrearContratoDTO, cliente: PoolClient) {
        const cuotaAlquiler: Cuota = {
            contrato_id: contratoId,
            fecha_inicio: new Date(contrato.fechaInicio),
            fecha_fin: new Date(contrato.fechaFin),
            monto: contrato.precioMensual,
        };
        await this.cuotaAlquilerRepository.saveAllCuotasForContrato(cuotaAlquiler, contrato.duracionMeses, cliente);
    }

    // crear primer consumo de luz
    private async crearPrimerConsumoLuz(contratoId: number, contrato: CrearContratoDTO, cliente: PoolClient) {
        const primerRegistro: Luz = {
            contrato_id: contratoId,
            fecha_inicio: new Date(contrato.fechaInicio),
            fecha_fin: new Date(contrato.fechaFin),
            lectura_anterior: 0,
            lectura_actual: contrato.lecturaAnterior,
            precio_kwh: 0,
            alumbrado_publico: 0,
            consumo_total: 0,
        };
        await this.consumoLuzRepository.saveFirstConsumoLuz(primerRegistro, cliente);
    }

    // crear garantia
    private async crearGarantia(contratoId: number, monto: number, fechaInicio: string, cliente: PoolClient) {
        const garantia: Garantia = {
            contrato_id: contratoId,
            monto: monto,
            fecha_registro: new Date(fechaInicio),
        };
        await this.garantiaRepository.saveGarantia(garantia, cliente);
    }

    // actualizar local a ocupado
    private async actualizarLocalOcupado(localId: number, contratoId: number, cliente: PoolClient) {
        await this.localRepository.updateLocalOcupado(localId, contratoId, cliente);
    }

}
