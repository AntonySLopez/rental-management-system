import pool from "../config/postgres.js";
import type { RegistrarLocalDTO } from "../schema/registrarLocalDTO.js";

export class LocalRepository {
 
    async findByNombre(nombre: string, propiedadId: number) {
        const result = await pool.query
        (`SELECT * FROM local WHERE nombre_local = $1 AND propiedad_id = $2`, [nombre, propiedadId]);
        return result.rows[0] ?? null;
    };

    async save(local: RegistrarLocalDTO) {
        const result = await pool.query
        (`INSERT INTO local (propiedad_id, nombre_local, descripcion, area, estado_id) 
            VALUES ($1, $2, $3, $4, (SELECT id FROM estado_general WHERE valor = 'activo')) 
            RETURNING *`, 
            [local.propiedadId, local.nombreLocal, local.descripcion, local.area]);
        return result.rows[0];
    };
};