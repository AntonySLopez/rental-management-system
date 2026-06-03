import pool from "../config/postgres.js";
import type { RegistrarInquilinoDTO } from "../application/registrarInquilinoDTO.js";

export class InquilinoRepository {

    async findByDocumento(documento: string) {
            const result = await pool.query('SELECT * FROM inquilino WHERE documento = $1', [documento]);
            return result.rows[0] ?? null;
        };

    async save(inquilino: RegistrarInquilinoDTO) {
            const result = await pool.query
            (`INSERT INTO inquilino (nombre, telefono, email, documento, estado_id) 
                VALUES ($1, $2, $3, $4, (SELECT id FROM estado_general WHERE valor = 'activo')) 
                RETURNING *`, 
                [inquilino.nombre, inquilino.telefono, inquilino.email, inquilino.documento]);
            return result.rows[0];
        };
};
