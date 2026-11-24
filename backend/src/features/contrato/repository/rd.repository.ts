import pool from "../../../infrastructure/postgres.js";

/**
 * RD Repository
 * Contiene las queries específicas para reglas de dominio
 */
export class RDRepository {

    /**
     * inquilinoExiste.repository()
     * Verifica si el inquilino existe
     */
    async inquilinoExiste(id: number) {
        const result = await pool.query('SELECT id FROM inquilino WHERE id = $1', [id]);
        return result.rows.length > 0;
    }

    /**
     * inquilinoActivo.repository()
     * Verifica si el inquilino tiene estado activo
     */
    async inquilinoActivo(id: number) {
        const result = await pool.query(
            `SELECT i.id FROM inquilino i 
             WHERE i.id = $1 AND i.estado = 'activo'`,
            [id]
        );
        return result.rows.length > 0;
    }

    /**
     * localExiste.repository()
     * Verifica si el local existe
     */
    async localExiste(id: number) {
        const result = await pool.query('SELECT id FROM local WHERE id = $1', [id]);
        return result.rows.length > 0;
    }

    /**
     * localLibre.repository()
     * Verifica si el local tiene estado libre
     */
    async localLibre(id: number) {
        const result = await pool.query(
            `SELECT l.id FROM local l 
             WHERE l.id = $1 AND l.estado = 'libre'`,
            [id]
        );
        return result.rows.length > 0;
    }
    
    /**
     * contratoExiste.repository()
     * Verifica si el contrato existe
     */
    async contratoExiste(id: number) {
        const result = await pool.query('SELECT id FROM contrato WHERE id = $1', [id]);
        return result.rows.length > 0;
    }

    /**
     * contratoVigente.repository()
     * Verifica si el contrato tiene estado activo o renovado
     */
    async contratoVigente(id: number) {
        const result = await pool.query(
            `SELECT id FROM contrato WHERE id = $1 AND estado IN ('activo', 'renovado')`,
            [id]
        );
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
     * contratoSinDeuda.repository()
     * Verifica que el contrato no tenga cuotas en estado activo o atrasado
     * ni consumos en estado pendiente
     */
    async contratoSinDeuda(contratoId: number) {
        const cuotasResult = await pool.query(
            `SELECT id FROM cuota_alquiler WHERE contrato_id = $1 AND estado IN ('activo', 'atrasado')`,
            [contratoId]
        );
        
        const consumosResult = await pool.query(
            `SELECT id FROM consumo_luz WHERE contrato_id = $1 AND estado = 'pendiente'`,
            [contratoId]
        );
        
        return cuotasResult.rows.length === 0 && consumosResult.rows.length === 0;
    }

    /**
     * fechaInicioValido.repository()
     * Verifica que la fecha_inicio sea superior a la fecha_fin de la última cuota pagada
     */
    async fechaInicioValido(contratoId: number, fechaInicio: string) {
        const result = await pool.query(
            `SELECT MAX(fecha_fin) as ultima_fecha_fin 
             FROM cuota_alquiler 
             WHERE contrato_id = $1 AND estado = 'pagado'`,
            [contratoId]
        );
        
        const ultimaFechaFin = result.rows[0]?.ultima_fecha_fin;
        
        // Si no hay cuotas pagadas, cualquier fecha es válida
        if (!ultimaFechaFin) return true;
        
        // Comparar fechas
        return new Date(fechaInicio) > new Date(ultimaFechaFin);
    }
}
