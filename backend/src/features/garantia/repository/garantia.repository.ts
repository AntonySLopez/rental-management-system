import type { PoolClient } from "pg";
import pool from "../../../infrastructure/postgres.js";

/**
 * GarantiaRepository
 * Métodos de acceso a datos para garantías
 */
export class GarantiaRepository {

    // obtenerGarantia - según B8
    // Obtiene los datos de la garantía del contrato
    async obtenerGarantia(contratoId: number) {
        const result = await pool.query(
            `SELECT 
                id, 
                contrato_id, 
                monto, 
                fecha_registro, 
                fecha_cierre, 
                observaciones, 
                estado
             FROM garantia 
             WHERE contrato_id = $1`,
            [contratoId]
        );
        return result.rows[0];
    }

    // obtenerMovimientoGarantia - según B8
    // Obtiene los movimientos de la garantía operados y calcula el saldo actual
    async obtenerMovimientoGarantia(garantiaId: number, poolClient?: PoolClient ): Promise<number> {
        const result = await (poolClient || pool).query(
            `SELECT 
                COALESCE(
                    SUM(
                        CASE 
                            WHEN tipo_accion = 'deposito' THEN monto 
                            WHEN tipo_accion IN ('devuelta', 'consumida') THEN -monto 
                            ELSE 0 
                        END
                    ), 
                    0 
                ) AS saldo_actual
            FROM movimiento_garantia
            WHERE garantia_id = $1;`,
            [garantiaId]
        );

        const saldo = result.rows[0].saldo_actual;
        return Number(saldo);
    }

    // listarMovimientos - según B8
    // Obtiene movimientos con paginación
    async listarMovimientos(garantiaId: number, page: number, limit: number) {
        const offset = (page - 1) * limit;
        const result = await pool.query(
            `SELECT 
                id, 
                fecha_registro, 
                monto, 
                metodo_pago, 
                referencia, 
                tipo_accion, 
                observaciones
             FROM movimiento_garantia
             WHERE garantia_id = $1
             ORDER BY fecha_registro DESC
             LIMIT $2 OFFSET $3`,
            [garantiaId, limit, offset]
        );
        
        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM movimiento_garantia WHERE garantia_id = $1`,
            [garantiaId]
        );
        const total = parseInt(totalResult.rows[0].count);
        
        return {
            data: result.rows,
            total: Math.ceil(total / limit),
            page,
            limit
        };
    }

    // registrarMovimientoGarantia - según B8
    // Registra un nuevo movimiento de garantía (transaccional)
    async registrarMovimientoGarantia(
        garantiaId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        tipoAccion: string,
        observaciones: string | null,
        poolClient: PoolClient
    ) {
        const result = await poolClient.query(
            `INSERT INTO movimiento_garantia(
                garantia_id, 
                fecha_registro, 
                monto, 
                metodo_pago, 
                referencia, 
                tipo_accion, 
                observaciones
            )
             VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6)
             RETURNING id`,
            [garantiaId, monto, metodoPago, referencia, tipoAccion, observaciones]
        );
        return result.rows[0];
    }

    // actualizarEstadoGarantia - según B8
    // Actualiza el estado de la garantía (transaccional)
    async actualizarEstadoGarantia(garantiaId: number, tipoAccion: string, poolClient: PoolClient) {

        await poolClient.query(
            `UPDATE garantia SET estado = $1, fecha_cierre = CURRENT_TIMESTAMP WHERE id = $2`,
            [tipoAccion, garantiaId]
        );
    }
    
}
