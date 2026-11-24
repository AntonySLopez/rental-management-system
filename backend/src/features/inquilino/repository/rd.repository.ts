import pool from "../../../infrastructure/postgres.js";

export class RdRepository {
    
    // documentoUnico - según B8
    async documentoUnico(documento: string) {
        const result = await pool.query(`
            SELECT 
                id 
            FROM inquilino 
            WHERE documento = $1`, [documento]);
        return result.rows[0] ?? null;
    }
    
    // inquilinoExiste - según B8
    async inquilinoExiste(id: number): Promise<{ id: number; documento: string } | null> {
        const result = await pool.query(`
            SELECT 
                id, 
                documento 
            FROM inquilino 
            WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }
}
