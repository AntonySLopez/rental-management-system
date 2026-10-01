import pool from "../../../infrastructure/postgres.js";
import type { PoolClient } from "pg";
import type { CrearContratoDTO } from "../interface/schema/crearContratoDTO.js";
import type { ContratoActivo, ContratoDetalle } from "../../../types/contrato.types.js";

export class ContratoRepository {
    // Guardar contrato
    async save(contrato: CrearContratoDTO, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`INSERT INTO contrato (inquilino_id, local_id, precio_mensual, duracion_meses, fecha_inicio, fecha_fin, estado_id) 
            VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM estado_contrato WHERE estado = 'activo')) 
            RETURNING *`, 
            [contrato.inquilinoId, contrato.localId, contrato.precioMensual, contrato.duracionMeses, contrato.fechaInicio, contrato.fechaFin]);
        return result.rows[0].id;
    }

    // validar contrato por id
    async findById(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`SELECT * FROM contrato c JOIN estado_contrato ec ON c.estado_id = ec.id WHERE c.id = $1`, [id]);
        return result.rows[0];
    }

    // cerrar contrato
    async close(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`UPDATE contrato SET estado_id = (SELECT id FROM estado_contrato WHERE estado = 'cerrado') WHERE id = $1`, [id]);
        return result.rows[0];
    }

    // renovar contrato
    async renovar(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`UPDATE contrato SET estado_id = (SELECT id FROM estado_contrato WHERE estado = 'renovado') WHERE id = $1`, [id]);
        return result.rows[0];
    }

    // lista de contratos activos
    async listaContratosActivos(): Promise<ContratoActivo[]> {
        const result = await pool.query
        (`
            SELECT 
                c.id, 
                p.nombre as propiedad_nombre, 
                l.nombre_local as local_nombre, 
                c.precio_mensual
            FROM contrato c
            JOIN local l ON c.local_id = l.id
            JOIN propiedad p ON l.propiedad_id = p.id
            JOIN estado_contrato ec ON c.estado_id = ec.id
            WHERE ec.estado = 'activo'
        `);
        return result.rows;
    }

    // buscar contrato por id
    async buscarContratoPorId(id: number): Promise<ContratoDetalle> {
        const result = await pool.query
        (`
            SELECT c.*, i.nombre as inquilino_nombre, l.nombre_local as local_nombre, p.nombre as propiedad_nombre
            FROM contrato c
            JOIN inquilino i ON c.inquilino_id = i.id
            JOIN local l ON c.local_id = l.id
            JOIN propiedad p ON l.propiedad_id = p.id
            JOIN estado_contrato ec ON c.estado_id = ec.id
            WHERE c.id = $1
        `, [id]);
        return result.rows[0];
    }
}
