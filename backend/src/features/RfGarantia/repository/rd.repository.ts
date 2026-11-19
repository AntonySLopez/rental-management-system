import pool from "../../../infrastructure/postgres.js";

/**
 * RDRepository
 * Métodos de acceso a datos para reglas de dominio
 */
export class RDRepository {

    /**
     * contratoExiste.repository()
     * Verifica si existe un contrato con el id recibido
     */
    async contratoExiste(id: number) {
        const result = await pool.query(
            `SELECT id FROM contrato WHERE id = $1`,
            [id]
        );
        return result.rows.length > 0;
    }

    /**
     * contratoTieneGarantia.repository()
     * Verifica si el contrato tiene una garantía registrada
     */
    async contratoTieneGarantia(contratoId: number) {
        const result = await pool.query(
            `SELECT id FROM garantia WHERE contrato_id = $1`,
            [contratoId]
        );
        return result.rows.length > 0;
    }

    /**
     * garantiaRetenida.repository()
     * Verifica si la garantía del contrato tiene estado 'retenida'
     */
    async garantiaRetenida(contratoId: number) {
        const result = await pool.query(
            `SELECT id FROM garantia WHERE contrato_id = $1 AND estado = 'retenida'`,
            [contratoId]
        );
        return result.rows.length > 0;
    }

    /**
     * montoNoSuperaSaldoGarantia.repository()
     * Verifica que el monto no supere el saldo de la garantía
     */
    async montoNoSuperaSaldoGarantia(contratoId: number, monto: number) {
        const result = await pool.query(
            `SELECT g.id, 
                COALESCE(SUM(CASE WHEN mg.tipo_accion = 'deposito' THEN mg.monto ELSE -mg.monto END), 0) as saldo
             FROM garantia g
             LEFT JOIN movimiento_garantia mg ON g.id = mg.garantia_id
             WHERE g.contrato_id = $1
             GROUP BY g.id`,
            [contratoId]
        );
        
        if (result.rows.length === 0) return false;
        
        const saldo = parseFloat(result.rows[0].saldo) || 0;
        return monto <= saldo;
    }
}
