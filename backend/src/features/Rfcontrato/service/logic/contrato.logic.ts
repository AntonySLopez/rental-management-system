import { ContratoRepository } from "../../repository/contrato.repository.js";
import type { ContratoInput } from "../../interface/types/contrato.types.js";
import type { NuevoContratoResponse } from "../../interface/types/contrato.types.js";
import type { ListarContratosResponse } from "../../interface/types/contrato.types.js";
import type { DetalleContratoResponse } from "../../interface/types/contrato.types.js";
import type { ActualizarContratoResponse } from "../../interface/types/contrato.types.js";
import type { CerrarContratoResponse } from "../../interface/types/contrato.types.js";
import type { RenovarContratoResponse } from "../../interface/types/contrato.types.js";
import pool from "../../../../infrastructure/postgres.js";

/**
 * ContratoLogic
 * Clase que agrupa todas las operaciones de lógica de negocio para contratos
 */
export class ContratoLogic {
    private contratoRepository: ContratoRepository;

    constructor(contratoRepository: ContratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    async operation9(contrato: ContratoInput): Promise<NuevoContratoResponse> {

        const poolClient = await pool.connect();
        try {
        //abrir transacción
        await poolClient.query('BEGIN');
        // 1. registrarContrato.repository()
        const contratoId = await this.contratoRepository.registrarContrato(contrato, poolClient);

        // 2. registrarNuevaGarantia.repository()
        if(contrato.garantia > 0) {
            await this.contratoRepository.registrarNuevaGarantia(
                contratoId, 
                contrato.garantia, 
                poolClient);
        }

        // 3. crearCuotasDeAlquiler.repository()
        const idCuota = await this.contratoRepository.crearCuotasDeAlquiler(
            contratoId, 
            contrato.fecha_inicio, 
            contrato.duracion_meses, 
            contrato.precio_mensual, 
            poolClient);

        // 4. registrarPagoAlquiler.repository()
        await this.contratoRepository.registrarPagoAlquiler(
            idCuota, 
            contrato.precio_mensual, 
            contrato.metodo_pago, 
            poolClient);

        // 5. actualizarEstadoLocal.repository()
        await this.contratoRepository.actualizarEstadoLocal(contrato.local_id, poolClient);

        //commit transacción
        await poolClient.query('COMMIT');
        
        //liberar conexión
        poolClient.release();
        
        return { id: contratoId.toString() };
        } catch (error) {
            //rollback transacción
            await poolClient.query('ROLLBACK');
            //liberar conexión
            poolClient.release();
            throw error;
        }
    }

    async operation10(page: number, limit: number): Promise<ListarContratosResponse> {
        const result = await this.contratoRepository.listarContratos(page, limit);
        
        return {
            data: result.data.map((row: any) => ({
                id: row.id.toString(),
                inquilino: row.inquilino,
                local: row.local,
                precio_mensual: row.precio_mensual,
                fecha_inicio: row.fecha_inicio,
                duracion_meses: row.duracion_meses,
                estado: row.estado
            })),
            total: result.total,
            page: result.page,
            limit: result.limit
        };
    }

    async operation11(id: number): Promise<DetalleContratoResponse> {
        // obtenerContrato.repository()
        const contrato = await this.contratoRepository.obtenerContrato(id);
        
        // obtenerCuotasAdeudadas.repository()
        const totalCuotasAdeudadas = await this.contratoRepository.obtenerCuotasAdeudadas(id);
        
        // ontenerConsumoAdeudado.respository()
        const totalConsumosPendientes = await this.contratoRepository.obtenerConsumoAdeudado(id);
        
        // calcularDeuda()
        const totalDeuda = totalCuotasAdeudadas + totalConsumosPendientes;
        
        return {
            id: contrato.id.toString(),
            inquilino: {
                id: contrato.inquilino_id.toString(),
                nombre: contrato.inquilino_nombre,
                documento: contrato.inquilino_documento
            },
            local: {
                id: contrato.local_id.toString(),
                nombre: contrato.local_nombre,
                area: contrato.local_area
            },
            precio_mensual: contrato.precio_mensual,
            garantia: contrato.garantia,
            lectura_inicial_luz: contrato.lectura_inicial_luz,
            fecha_creacion: contrato.fecha_creacion,
            fecha_inicio: contrato.fecha_inicio,
            duracion_meses: contrato.duracion_meses,
            observaciones: contrato.observaciones,
            estado: contrato.estado,
            deuda: {
                total_cuotas_adeudadas: totalCuotasAdeudadas,
                total_consumos_pendientes: totalConsumosPendientes,
                total_deuda: totalDeuda
            }
        };
    }
    // /**  operation 12 secervado para caso de uso actualizar observacion de contrato */
    // async operation12(contratoId: number, observaciones?: string): Promise<void> {
    //     // actualizarContratoObservaciones.repository()
    //         await this.contratoRepository.actualizarContratoObservaciones(contratoId, poolClient, observaciones);
    // }

    async operation13(contratoId: number, localId: number, observaciones?: string): Promise<ActualizarContratoResponse> {

        const poolClient = await pool.connect();

        await poolClient.query('BEGIN');
        try {
            // actualizarEstadoLocal.repository()
            await this.contratoRepository.alternarDisponibilidadLocal(contratoId, localId, poolClient);
            // actualizarContratoLocal.repository()
            await this.contratoRepository.actualizarContratoLocal(contratoId, localId, poolClient, observaciones);
            // actualizarContratoObservaciones.repository()
            await this.contratoRepository.actualizarContratoObservaciones(contratoId, poolClient, observaciones);

            await poolClient.query('COMMIT');

            return { id: contratoId.toString() };

        } catch (error) {
            await poolClient.query('ROLLBACK');
            throw error;
        } finally {
            await poolClient.release();
        }
    }

    async operation14(contratoId: number): Promise<CerrarContratoResponse> {
        const poolClient = await pool.connect();

        await poolClient.query('BEGIN');

        try {
        // cerrarContrato.repository()
        await this.contratoRepository.cerrarContrato(contratoId, poolClient);
        // liberarEstadoLocal.repository()
        await this.contratoRepository.liberarEstadoLocal(contratoId, poolClient);
        
        await poolClient.query('COMMIT');
        
        return {
            success: true,
            message: "Contrato cerrado exitosamente"
        };
        } catch (error) {
            await poolClient.query('ROLLBACK');
            throw error;
        } finally {
            await poolClient.release();
        }
    }

    /**
     * operation15 - renovarContrato
     * Lógica concreta para renovar un contrato
     * Reutiliza lógica de crear contrato pero con datos del contrato anterior
     */
    async operation15(
        contratoId: number, 
        fechaInicio: string, 
        precioMensual?: number, 
        observaciones?: string
    ): Promise<RenovarContratoResponse> {
        const poolClient = await pool.connect();

        await poolClient.query('BEGIN');

        try {
            // 1. extraerGarantiaByid.repository()
            const garantia = await this.contratoRepository.extraerGarantiaByid(contratoId, poolClient);

            // 2. renovarContrato.repository()
            await this.contratoRepository.renovarContrato(contratoId, poolClient);

            // 3. obtenerDatosContrato - para reutilizar en el nuevo contrato
            const datosContrato = await this.contratoRepository.obtenerDatosContrato(contratoId, poolClient);

            // 4. guardarContrato.repository() - crear nuevo contrato con datos del anterior
            const nuevoContrato: ContratoInput = {
                inquilino_id: datosContrato.inquilino_id,
                local_id: datosContrato.local_id,
                precio_mensual: precioMensual ?? datosContrato.precio_mensual,
                garantia: garantia,
                lectura_inicial_luz: datosContrato.lectura_inicial_luz,
                fecha_inicio: fechaInicio,
                duracion_meses: datosContrato.duracion_meses,
                observaciones: observaciones ?? null,
                metodo_pago: datosContrato.metodo_pago,
                referencia: datosContrato.referencia ?? undefined
            };

            const nuevoContratoId = await this.contratoRepository.registrarContrato(nuevoContrato, poolClient);

            // 5. registrarNuevaGarantia.repository()
            if (garantia > 0) {
                await this.contratoRepository.registrarNuevaGarantia(nuevoContratoId, garantia, poolClient);
            }

            // 6. crearCuotasDeAlquiler.repository()
            const idCuota = await this.contratoRepository.crearCuotasDeAlquiler(
                nuevoContratoId,
                fechaInicio,
                datosContrato.duracion_meses,
                nuevoContrato.precio_mensual,
                poolClient
            );

            // 7. registrarPagoAlquiler.repository() - primera cuota
            await this.contratoRepository.registrarPagoAlquiler(
                idCuota,
                nuevoContrato.precio_mensual,
                nuevoContrato.metodo_pago,
                poolClient
            );

            await poolClient.query('COMMIT');

            return { id: nuevoContratoId.toString() };
        } catch (error) {
            await poolClient.query('ROLLBACK');
            throw error;
        } finally {
            await poolClient.release();
        }
    }
}
