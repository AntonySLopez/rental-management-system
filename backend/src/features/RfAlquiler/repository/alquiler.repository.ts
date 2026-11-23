import type { PoolClient } from "pg";
import pool from "../../../infrastructure/postgres.js";

/**
 * Alquiler Repository
 * Contiene las queries específicas para operaciones de alquiler
 */
export class AlquilerRepository {

    /**
     * listarCuotas.repository()
     * Extrae todas las cuotas del contrato recibido, incluidas las anuladas
     */
    async listarCuotas(contratoId: number) {
        const result = await pool.query(
            `SELECT 
                id, 
                fecha_inicio, 
                fecha_vencimiento, 
                monto, 
                estado 
            FROM cuota_alquiler 
            WHERE contrato_id = $1 
            ORDER BY fecha_inicio`,
            [contratoId]
        );
        return result.rows;
    }

    /**
     * obtenerPagoAlquiler.repository()
     * Obtiene información del pago registrado sobre la cuota_id
     */
    async obtenerPagoAlquiler(cuotaId: number) {
        const result = await pool.query(
            `SELECT 
                id, 
                monto, 
                metodo_pago, 
                referencia, 
                fecha_registro, 
                observaciones 
            FROM pago_alquiler 
            WHERE cuota_alquiler_id = $1`,
            [cuotaId]
        );
        return result.rows[0];
    }

    /**
     * obtenerCuota.repository()
     * Obtiene datos de la cuota
     */
    async obtenerCuota(cuotaId: number) {
        const result = await pool.query(
            `SELECT 
                id, 
                monto 
            FROM cuota_alquiler 
            WHERE id = $1`,
            [cuotaId]
        );
        return result.rows[0];
    }

    /**
     * registrarPagoAlquiler.repository()
     * Inserta el pago en la base de datos
     */
    async registrarPagoAlquiler(
        cuotaId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        observaciones: string | null,
        poolClient: PoolClient  
    ) {
        const result = await poolClient.query(
            `INSERT INTO pago_alquiler (
                cuota_alquiler_id, 
                monto, 
                metodo_pago, 
                referencia, 
                observaciones
            )
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [cuotaId, monto, metodoPago, referencia ?? 'sin referencia', observaciones ?? 'Inicio de contrato']
        );
        return result.rows[0];
    }

    /**
     * actualizarCuota.repository()
     * Actualiza estado de la cuota a pagado
     */
    async actualizarCuota(cuotaId: number, poolClient: PoolClient) {
        await poolClient.query(
            `UPDATE cuota_alquiler 
            SET estado = 'pagado' 
            WHERE id = $1`,
            [cuotaId]
        );
    }
}
