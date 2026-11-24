import type { PoolClient } from "pg";
import pool from "../../../infrastructure/postgres.js";
import type { ConsumoInput } from "../interface/types/consumo.types.js";

/**
 * Consumo Repository
 * Operaciones directas a la tabla consumo_luz y pago_consumo
 */
export class ConsumoRepository {

    /**
     * registrarConsumo.repository()
     * Inserta un nuevo consumo de luz con estado 'pendiente'
     */
    async registrarConsumo(input: ConsumoInput): Promise<{ id: number }> {
        const result = await pool.query(
            `INSERT INTO consumo_luz (
                contrato_id,
                fecha_inicio,
                fecha_fin,
                lectura_anterior,
                lectura_actual,
                precio_kwh,
                alumbrado_publico,
                monto
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
            [
                input.contrato_id,
                input.fecha_inicio,
                input.fecha_fin,
                input.lectura_anterior,
                input.lectura_actual,
                input.precio_kwh,
                input.alumbrado_publico,
                input.monto
            ]
        );

        return { id: Number(result.rows[0].id) };
    }

    /**
     * listarConsumos.repository()
     * Extrae todos los registros de consumo de luz del contrato recibido
     */
    async listarConsumos(contratoId: number) {
        const result = await pool.query(
            `SELECT 
                id, 
                fecha_inicio, 
                fecha_fin, 
                consumo_kwh_total, 
                monto, 
                estado 
            FROM consumo_luz 
            WHERE contrato_id = $1 
            ORDER BY fecha_inicio ASC, id ASC`,
            [contratoId]
        );
        return result.rows;
    }

    /**
     * obtenerConsumoById.repository()
     * Consulta todos los datos del consumo de luz por id
     */
    async obtenerConsumoById(consumoId: number) {
        const result = await pool.query(
            `SELECT 
                id,
                contrato_id,
                fecha_inicio,
                fecha_fin,
                lectura_anterior,
                lectura_actual,
                consumo_kwh_total,
                precio_kwh,
                alumbrado_publico,
                monto,
                estado
            FROM consumo_luz
            WHERE id = $1`,
            [consumoId]
        );
        return result.rows[0];
    }

    /**
     * obtenerPagoConsumo.repository()
     * Consulta el pago registrado del consumo si existe
     */
    async obtenerPagoConsumo(consumoId: number) {
        const result = await pool.query(
            `SELECT 
                id,
                monto,
                metodo_pago,
                referencia,
                fecha_registro,
                observaciones
            FROM pago_consumo
            WHERE consumo_luz_id = $1`,
            [consumoId]
        );
        return result.rows[0] ?? null;
    }

    /**
     * registrarPagoConsumo.repository()
     * Inserta el pago en la tabla pago_consumo
     */
    async registrarPagoConsumo(
        consumoId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        observaciones: string | null,
        poolClient: PoolClient
    ) {
        const result = await poolClient.query(
            `INSERT INTO pago_consumo (
                consumo_luz_id,
                monto,
                metodo_pago,
                referencia,
                observaciones
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
            [
                consumoId,
                monto,
                metodoPago,
                referencia ?? 'sin referencia',
                observaciones ?? 'Pago de consumo'
            ]
        );
        return result.rows[0];
    }

    /**
     * actualizarConsumo.repository()
     * Actualiza el estado del consumo a 'pagado'
     */
    async actualizarConsumo(consumoId: number, poolClient: PoolClient) {
        await poolClient.query(
            `UPDATE consumo_luz 
            SET estado = 'pagado' 
            WHERE id = $1`,
            [consumoId]
        );
    }
}
