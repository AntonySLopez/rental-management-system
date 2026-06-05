import pool from "../config/postgres.js";
import type { RegistrarPropiedadDTO } from "../schema/registrarPropiedadDTO.js";

export class PropiedadRepository {
    
    async findByNombre(nombre: string) {
        const result = await pool.query
        (`SELECT * FROM propiedad WHERE nombre = $1`, [nombre]);
        return result.rows[0] ?? null;
    };

    async save(propiedad: RegistrarPropiedadDTO) {
        const result = await pool.query
        (`INSERT INTO propiedad (nombre, direccion, descripcion, estado_id) VALUES ($1, $2, $3, (SELECT id FROM estado_general WHERE valor = 'activo')) RETURNING *`, 
        [propiedad.nombre, propiedad.direccion, propiedad.descripcion]);
        return result.rows[0];
    }
}