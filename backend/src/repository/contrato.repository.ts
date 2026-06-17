import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { CrearContratoDTO } from "../schema/crearContratoDTO.js";

export class ContratoRepository {
    // Valida disponibilidad de un local para un contrato nuevo
    async validarLocalDisponible(localId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`SELECT 1 FROM contrato WHERE local_id = $1 AND estado_id = (SELECT id FROM estado_general WHERE valor = 'activo')`, [localId]);
        return result.rows[0];
    }

    // Guardar contrato
    async save(contrato: CrearContratoDTO, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`INSERT INTO contrato (inquilino_id, local_id, precio_mensual, duracion_meses, fecha_inicio, fecha_fin, estado_id) 
            VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM estado_general WHERE valor = 'activo')) 
            RETURNING *`, 
            [contrato.inquilinoId, contrato.localId, contrato.precioMensual, contrato.duracionMeses, contrato.fechaInicio, contrato.fechaFin]);
        return result.rows[0].id;
    }

    // validar contrato por id
    async findById(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`SELECT ec.estado FROM contrato c JOIN estado_contrato ec ON c.estado_id = ec.id WHERE c.id = $1`, [id]);
        return result.rows[0];
    }

    // cerrar contrato
    async close(id: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`UPDATE contrato SET estado_id = (SELECT id FROM estado_contrato WHERE estado = 'cerrado') WHERE id = $1`, [id]);
        return result.rows[0];
    }
}
