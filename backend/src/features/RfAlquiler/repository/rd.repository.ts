import pool from "../../../infrastructure/postgres.js";

/**
 * RD Repository
 * Contiene las queries específicas para reglas de dominio
 */
export class RDRepository {

    /**
     * contratoExiste.repository()
     * Verifica si el contrato existe
     */
    async contratoExiste(id: number) {
        const result = await pool.query(`
            SELECT 
                id 
            FROM contrato 
            WHERE id = $1`, [id]);
        return result.rows.length > 0;
    }

    /**
     * contratoActivo.repository()
     * Verifica si el contrato tiene estado activo
     */
    async contratoActivo(id: number) {
        const result = await pool.query(
            `SELECT id FROM contrato WHERE id = $1 AND estado = 'activo'`,
            [id]
        );
        return result.rows.length > 0;
    }

    /**
     * cuotaExiste.repository()
     * Verifica si la cuota existe y pertenece al contrato
     */
    async cuotaExiste(cuotaId: number, contratoId: number) {
        const result = await pool.query(
            `SELECT 
                id 
            FROM cuota_alquiler 
            WHERE id = $1 AND contrato_id = $2`,
            [cuotaId, contratoId]
        );
        return result.rows.length > 0;
    }

    /**
     * cuotaNoAnulada.repository()
     * Verifica que la cuota no tenga estado anulada
     */
    async cuotaNoAnulada(cuotaId: number) {
        const result = await pool.query(
            `SELECT 
                id 
            FROM cuota_alquiler 
            WHERE id = $1 AND estado != 'anulada'`,
            [cuotaId]
        );
        return result.rows.length > 0;
    }

    /**
     * cuotaPagable.repository()
     * Verifica que la cuota tenga estado pendiente, activo o atrasado
     */
    async cuotaPagable(cuotaId: number) {
        const result = await pool.query(
            `SELECT 
                id 
            FROM cuota_alquiler 
            WHERE id = $1 AND estado IN ('pendiente', 'activo', 'atrasado')`,
            [cuotaId]
        );
        return result.rows.length > 0;
    }

    /**
     * montoIgualAMontoCuota.repository()
     * Verifica que el monto recibido es igual al monto de la cuota
     */
    async montoIgualAMontoCuota(cuotaId: number, monto: number) {
        const result = await pool.query(
            `SELECT 
                monto 
            FROM cuota_alquiler 
            WHERE id = $1`,
            [cuotaId]
        );
        const montoCuota = Number(result.rows[0]?.monto);
        return montoCuota === monto;
    }

    /**
     * cuotaSiguiente.repository()
     * Verifica que el id de cuota sea la cutoa siguinete a pagar
     */

    async cuotaSiguiente(contratoId: number) {
        const result = await pool.query(
            `SELECT 
                id
            FROM cuota_alquiler
            WHERE contrato_id = $1
              AND id > COALESCE(
                  (
                      SELECT MAX(id)
                      FROM cuota_alquiler
                      WHERE contrato_id = $1
                        AND estado = 'pagado'
                  ),
                  0
              )
            ORDER BY id ASC
            LIMIT 1`,
            [contratoId]
        );

        const cuotaSiguiente = Number(result.rows[0].id) || null

        return cuotaSiguiente;
    }
}
