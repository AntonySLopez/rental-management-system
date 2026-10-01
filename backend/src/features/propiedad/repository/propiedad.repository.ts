import pool from "../../../infrastructure/postgres.js";
import type { RegistrarPropiedadDTO } from "../interface/schema/registrarPropiedadDTO.js";

export class PropiedadRepository {
    
    async findById(id: number) {
        const result = await pool.query
        (`SELECT * FROM propiedad WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }

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
    };
    
    async findAll() {
        const result = await pool.query
        (`select id, nombre from propiedad`);
        return result.rows;
    };
}