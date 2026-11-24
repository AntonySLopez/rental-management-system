import pool from "../../../infrastructure/postgres.js";
import type { LocalInput } from "../interface/types/local.types.js";

export class LocalRepository {

    // guardarLocal - según B8
    async guardarLocal(local: LocalInput): Promise<string> {
        const result = await pool.query(`
            INSERT INTO local (
                nombre, 
                descripcion, 
                area)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [local.nombre, local.descripcion, local.area]
        );
        return result.rows[0].id.toString();
    }

    // listarLocales - según B8
    async listarLocales(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const result = await pool.query(`
            SELECT 
                id, 
                nombre, 
                area, 
                estado 
            FROM local 
            ORDER BY id 
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return {
            data: result.rows
        };
    }

    // obtenerLocalById - según B8
    async obtenerLocalById(id: number) {
        const result = await pool.query(`
            SELECT 
                id, 
                nombre, 
                descripcion, 
                area, 
                estado 
            FROM local 
            WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }

    // actualizarLocalById - según B8
    async actualizarLocalById(id: number, data: any) {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (data.nombre !== undefined) {
            fields.push(`nombre = $${paramIndex++}`);
            values.push(data.nombre);
        }
        if (data.descripcion !== undefined) {
            fields.push(`descripcion = $${paramIndex++}`);
            values.push(data.descripcion ?? null);
        }
        if (data.area !== undefined) {
            fields.push(`area = $${paramIndex++}`);
            values.push(data.area);
        }

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        values.push(id);
        const query = `UPDATE local SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id`;

        const result = await pool.query(query, values);
        return result.rows[0].id.toString();
    }
}
