import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { RegistrarInquilinoDTO } from "../schema/registrarInquilinoDTO.js";

export class InquilinoRepository {

    // Buscar inquilino por ID
    async findById(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query('SELECT * FROM inquilino WHERE id = $1', [id]);
        return result.rows[0] ?? null;
    }
    // Buscar inquilino por documento
    async findByDocumento(documento: string) {
            const result = await pool.query('SELECT * FROM inquilino WHERE documento = $1', [documento]);
            return result.rows[0] ?? null;
        };
    // Guardar nuevo inquilino
    async save(inquilino: RegistrarInquilinoDTO) {
            const result = await pool.query
            (`INSERT INTO inquilino (nombre, telefono, email, documento, estado_id) 
                VALUES ($1, $2, $3, $4, (SELECT id FROM estado_general WHERE valor = 'activo')) 
                RETURNING *`, 
                [inquilino.nombre, inquilino.telefono, inquilino.email, inquilino.documento]);
            return result.rows[0];
        };
};
