import { GarantiaRepository } from "../../repository/garantia.repository.js";
import type { DetalleGarantiaResponse } from "../../interface/types/garantia.types.js";
import type { ListarMovimientosGarantiaResponse } from "../../interface/types/garantia.types.js";
import pool from "../../../../infrastructure/postgres.js";


/**
 * GarantiaLogic
 * Clase que agrupa todas las operaciones de lógica de negocio para garantías
 */
export class GarantiaLogic {
    private garantiaRepository: GarantiaRepository;

    constructor(garantiaRepository: GarantiaRepository) {
        this.garantiaRepository = garantiaRepository;
    }

    /**
     * operation16 - detalleGarantia
     * Obtiene los datos de la garantía, sus movimientos y calcula el saldo
     */
    async operation16(contratoId: number): Promise<DetalleGarantiaResponse> {
        // obtenerGarantia.repository()
        const garantia = await this.garantiaRepository.obtenerGarantia(contratoId);
        
        // obtenerMovimientoGarantia.repository()
        const movimientos = await this.garantiaRepository.obtenerMovimientoGarantia(garantia.id);
        
        // obtenerSaldoGarantia.repository()
        const saldo = garantia.monto - movimientos;
        
        return {
            id: garantia.id.toString(),
            contrato_id: garantia.contrato_id.toString(),
            monto: Number(garantia.monto),
            saldo: saldo,
            fecha_registro: garantia.fecha_registro.toISOString(),
            fecha_cierre: garantia.fecha_cierre?.toISOString() || 'sin fecha de cierre',
            observaciones: garantia.observaciones,
            estado: garantia.estado
        };
    }

    /**
     * operation18 - listarMovimientosGarantia
     * Lista movimientos de garantía con paginación
     */
    async operation18(contratoId: number, page: number, limit: number): Promise<ListarMovimientosGarantiaResponse> {
        // obtenerGarantia.repository() para obtener garantia_id
        const garantiaId = await this.garantiaRepository.obtenerGarantia(contratoId);
        
        // listarMovimientos.repository()
        const result = await this.garantiaRepository.listarMovimientos(garantiaId.id, page, limit);
        
        return {
            data: result.data.map((row: any) => ({
                id: row.id.toString(),
                fecha_registro: row.fecha_registro,
                monto: row.monto,
                metodo_pago: row.metodo_pago,
                referencia: row.referencia,
                tipo_accion: row.tipo_accion,
                observaciones: row.observaciones
            })),
            total: result.total,
            page: result.page,
            limit: result.limit
        };
    }

    /**
     * operation19 - registrarMovimientoGarantia
     * Registra el movimiento y retorna garantia_id
     */
    async operation19(
        contratoId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        tipoAccion: string,
        observaciones: string | null,
    ): Promise<number> {

        const poolClient = await pool.connect();
        await poolClient.query('BEGIN');

        try {
             // obtenerGarantia.repository() para obtener garantia_id
        const garantia = await this.garantiaRepository.obtenerGarantia(contratoId);
        
        // registrarMovimientoGarantia.repository()
        await this.garantiaRepository.registrarMovimientoGarantia(
            garantia.id,
            monto,
            metodoPago,
            referencia,
            tipoAccion,
            observaciones,
            poolClient
        );

        const saldoMovimientos = await this.garantiaRepository.obtenerMovimientoGarantia(garantia.id);

        const saldoActual = Number(garantia.monto) + saldoMovimientos;
        console.log(`saldoActual es ${saldoActual}`);
        
        if(saldoActual - monto == 0) {
            // cerrarGarantia.repository()
            await this.garantiaRepository.actualizarEstadoGarantia(garantia.id, tipoAccion, poolClient);
        }
        await poolClient.query('COMMIT');
        return garantia.id;
            
        } catch (error) {
            await poolClient.query('ROLLBACK');
            throw error;
        } finally {
            await poolClient.release();
        }
       
    }

}
