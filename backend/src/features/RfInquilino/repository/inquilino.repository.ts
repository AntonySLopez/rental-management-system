import pool from "../../../infrastructure/postgres.js";
import type { PoolClient } from "pg";
import type { InquilinoInput } from "../interface/types/inquilino.types.js";

export class InquilinoRepository {


    // registrarInquilino - según B8
    async registrarInquilino(inquilino: InquilinoInput) {
        const result = await pool.query(`
            INSERT INTO inquilino (nombre, telefono, email, documento)
            VALUES ($1, $2, $3, $4)
            RETURNING id, fecha_registro, estado;`,
            [inquilino.nombre, inquilino.telefono, inquilino.email, inquilino.documento]
        );
        return result.rows[0];
    }

    // listarInquilinos - según B8
    async listarInquilinos(page: number, limit: number) {
        const offset = (page - 1) * limit;
        
        const result = await pool.query(`
            SELECT 
                id,
                nombre,
                telefono,
                documento,
                estado
            FROM inquilino
            ORDER BY id ASC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
        const totalResult = await pool.query('SELECT COUNT(*) FROM inquilino');
        const total = parseInt(totalResult.rows[0].count);
        
        return {
            data: result.rows,
            total,
            page,
            limit
        };
    }


    // obtenerInquilinoById - según B8
    async obtenerInquilinoById(id: number) {
        const result = await pool.query(`
            SELECT 
                id,
                nombre,
                telefono,
                email,
                documento,
                fecha_registro,
                estado
            FROM inquilino
            WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    }

    // editarInquilino - según B8
    async editarInquilino(id: number, data: any) {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (data.nombre !== undefined) {
            fields.push(`nombre = $${paramIndex++}`);
            values.push(data.nombre);
        }
        if (data.telefono !== undefined) {
            fields.push(`telefono = $${paramIndex++}`);
            values.push(data.telefono);
        }
        if (data.email !== undefined) {
            fields.push(`email = $${paramIndex++}`);
            values.push(data.email);
        }
        if (data.documento !== undefined) {
            fields.push(`documento = $${paramIndex++}`);
            values.push(data.documento);
        }

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        values.push(id);
        const query = `UPDATE inquilino SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id`;

        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
