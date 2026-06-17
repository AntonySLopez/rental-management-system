import { ContratoRepository } from "../repository/contrato.repository.js";
import { movimientoRepository } from "../repository/movimiento.repository.js";
import { GarantiaRepository } from "../repository/garantia.repository.js";
import type { Movimiento } from "../types/movimiento.types.js";
import type { GarantiaUpdate, GarantiaMovimiento } from "../types/gestionGarantia.types.js";
import type { GestionarGarantiaDTO } from "../schema/gestionarGarantiaDTO.js";

import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class GarantiaService {
    // instancia de garantia repository
    private garantiaRepository: GarantiaRepository;
    private contratoRepository: ContratoRepository;
    private movimientoRepository: movimientoRepository;
    
    constructor() {
        this.garantiaRepository = new GarantiaRepository();
        this.contratoRepository = new ContratoRepository();
        this.movimientoRepository = new movimientoRepository();
    }
    // devolver garantia
    async devolverGarantia(garantia: GestionarGarantiaDTO) {
        // creamos hijo
        const client: PoolClient = await pool.connect();
        try {
            await client.query('BEGIN');
            // valida que el contrato exista y esté activo
            await this.validarContratoExistente(garantia.contrato_id, client);
            console.log('contrato valido');
            
            // valida que la garantia exista
            const garantiaExistente = await this.validarGarantiaExistente(garantia.contrato_id, client);
            console.log('garantia valida');
            
            // guardar movimiento de garantia
            const movimiento = await this.guardarMovimientoGarantia(garantiaExistente, garantia.tipo_operacion, client);
            console.log('movimiento guardado');
            
            // actualizar garantia
            await this.actualizarGarantia(garantiaExistente, movimiento.id, garantia.tipo_operacion, client);
            console.log('garantia actualizada');
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    }

    // aplicar garantia
    async aplicarGarantia(garantia: GestionarGarantiaDTO) {
        // creamos hijo
        const client: PoolClient = await pool.connect();
        try {
            await client.query('BEGIN');
        // valida que el contrato exista y esté activo
        await this.validarContratoExistente(garantia.contrato_id, client);
        console.log('contrato valido');

        // valida que la garantia exista
        const garantiaExistente = await this.validarGarantiaExistente(garantia.contrato_id, client);
        console.log('garantia valida');

        // guardar movimiento de garantia
        const movimiento = await this.guardarMovimientoGarantia(garantiaExistente, garantia.tipo_operacion, client);
        console.log('movimiento guardado');
        
        // actualizar garantia
        await this.actualizarGarantia(garantiaExistente, movimiento.id, garantia.tipo_operacion, client);
        console.log('garantia actualizada');
        
        await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // validar contrato existente
    private async validarContratoExistente(contratoId: number , client: PoolClient) {
        const contratoExistente = await this.contratoRepository.findById(contratoId, client);
        if (!contratoExistente || contratoExistente.estado == "activo") {
            throw new AppError("No se puede gestionar una garantía de un contrato activo", 409);
        }
    }

    // valida garantia existente
    private async validarGarantiaExistente(contratoId: number, client: PoolClient) {        
        const garantiaExistente = await this.garantiaRepository.findByContratoId(contratoId, client);
        if (!garantiaExistente) {
            throw new AppError("La garantia no existe", 404);
        }
        return {
            id: garantiaExistente.id,
            contrato_id: garantiaExistente.contrato_id,
            monto: garantiaExistente.monto,
            observaciones: garantiaExistente.observaciones
        };
    }

    // guardar movimiento de garantia
    private async guardarMovimientoGarantia(garantia: GarantiaMovimiento, tipoOperacion: string, client: PoolClient) {
        const movimiento: Movimiento = {
            contrato_id: garantia.contrato_id,
            fecha: new Date(),
            monto: garantia.monto,
            metodo_pago: "efectivo",
            referencia: "",
            descripcion: `gestion de garantia: ${tipoOperacion}`
        };
        const movimientoGuardado = await this.movimientoRepository.saveMovimiento(movimiento, client);
        return movimientoGuardado;
    }

    // actualizar garantia
    private async actualizarGarantia(garantia: GarantiaMovimiento, movimientoId: number, estado: string, cliente: PoolClient) {
        const garantiaActualizada: GarantiaUpdate = {
            fecha_movimiento: new Date(),
            observaciones: garantia.observaciones + ` | gestion: ${estado}`,
            estado_id: estado,
            movimiento_id: movimientoId
        };
        await this.garantiaRepository.updateEstadoByContratoId(garantia.contrato_id, garantiaActualizada, cliente);
    }
}
