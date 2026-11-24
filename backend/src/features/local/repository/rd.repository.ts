import pool from "../../../infrastructure/postgres.js";

export class RDRepository {


    async nombreLocalUnico(nombre: string, id?: number): Promise<number | null> {
        let query = `
            SELECT id 
            FROM local 
            WHERE LOWER(nombre) = LOWER($1)`;
        const params: any[] = [nombre];
        
        if (id !== undefined) {
            query += ' AND id != $2';
            params.push(id);
        }
        
        const result = await pool.query(query, params);
        return result.rows[0] ?? null;
    }

    async localExiste(id: number): Promise<boolean> {
        const result = await pool.query('SELECT id FROM local WHERE id = $1', [id]);
        return result.rows.length > 0;
    }
}
