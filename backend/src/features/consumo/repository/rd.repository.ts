import pool from "../../../infrastructure/postgres.js";

/**
 * RD Repository - Reglas de Dominio para Consumo
 */
export class RDRepository {

    /**
     * contratoExiste.repository()
     * Verifica si el contrato existe
     */
    async contratoExiste(id: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT id FROM contrato WHERE id = $1`,
            [id]
        );
        return result.rows.length > 0;
    }

    /**
     * contratoActivo.repository()
     * Verifica si el contrato tiene estado activo
     */
    async contratoActivo(id: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT id FROM contrato WHERE id = $1 AND estado = 'activo'`,
            [id]
        );
        return result.rows.length > 0;
    }

    /**
     * consumoExiste.repository()
     * Verifica si el consumo existe y pertenece al contrato recibido
     */
    async consumoExiste(consumoId: number, contratoId: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT id FROM consumo_luz WHERE id = $1 AND contrato_id = $2`,
            [consumoId, contratoId]
        );
        return result.rows.length > 0;
    }

    /**
     * consumoNoAnulado.repository()
     * Verifica que el consumo no tenga estado 'anulada'
     */
    async consumoNoAnulado(consumoId: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT id FROM consumo_luz WHERE id = $1 AND estado != 'anulada'`,
            [consumoId]
        );
        return result.rows.length > 0;
    }

    /**
     * consumoPagable.repository()
     * Verifica que el consumo tenga estado 'pendiente'
     */
    async consumoPagable(consumoId: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT id FROM consumo_luz WHERE id = $1 AND estado = 'pendiente'`,
            [consumoId]
        );
        return result.rows.length > 0;
    }

    /**
     * montoIgualAMontoConsumo.repository()
     * Verifica que el monto recibido sea igual al monto del consumo
     */
    async montoIgualAMontoConsumo(consumoId: number, monto: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT monto FROM consumo_luz WHERE id = $1`,
            [consumoId]
        );
        if (result.rows.length === 0) return false;
        const montoConsumo = Number(result.rows[0].monto);
        return montoConsumo === monto;
    }

    /**
     * obtenerUltimoConsumo.repository()
     * Obtiene el consumo más reciente no anulado del contrato
     */
    async obtenerUltimoConsumo(contratoId: number): Promise<{ lectura_actual: number } | null> {
        const result = await pool.query(
            `SELECT lectura_actual 
             FROM consumo_luz 
             WHERE contrato_id = $1 AND estado != 'anulada' 
             ORDER BY id DESC 
             LIMIT 1`,
            [contratoId]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return {
            lectura_actual: Number(result.rows[0].lectura_actual)
        };
    }

    /**
     * obtenerLecturaInicialContrato.repository()
     * Obtiene la lectura_inicial_luz del contrato
     */
    async obtenerLecturaInicialContrato(contratoId: number): Promise<{ lectura_inicial_luz: number } | null> {
        const result = await pool.query(
            `SELECT lectura_inicial_luz 
             FROM contrato 
             WHERE id = $1`,
            [contratoId]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return {
            lectura_inicial_luz: Number(result.rows[0].lectura_inicial_luz)
        };
    }
}
