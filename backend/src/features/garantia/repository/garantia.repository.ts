import pool from "../../../infrastructure/postgres.js";
import type { PoolClient } from "pg";
import type { Garantia } from "../../../types/garantia.types.js";
import type { GarantiaUpdate } from "../../../types/gestionGarantia.types.js";

export class GarantiaRepository {
    
    // guarda una garantia para un contrato
    async saveGarantia(garantia: Garantia, cliente?: PoolClient) {
       
            const result = await (cliente ?? pool).query(
                `INSERT INTO garantia (contrato_id, monto, fecha_registro, observaciones, estado_id) 
                VALUES ($1, $2, $3, $4, (SELECT id FROM estado_garantia WHERE estado = 'retenida')) 
                RETURNING *`,
                [garantia.contrato_id, garantia.monto, garantia.fecha_registro, garantia.observaciones]
            );
        return result.rows[0];
    }

    //busca por contrato_id
    async findByContratoId(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `SELECT * FROM garantia WHERE contrato_id = $1 and estado_id = (SELECT id FROM estado_garantia WHERE estado = 'retenida')`,
            [contratoId]
        );
        return result.rows[0];
    }

    // actualiza estado por contrato_id
    async updateEstadoByContratoId(contratoId: number, garantia: GarantiaUpdate, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `UPDATE garantia SET fecha_movimiento = $2, observaciones = $3, estado_id = (SELECT id FROM estado_garantia WHERE estado = $4), movimiento_id = $5 WHERE contrato_id = $1`,
            [contratoId, garantia.fecha_movimiento, garantia.observaciones, garantia.estado_id, garantia.movimiento_id]
        );
        return result.rows[0];
    }

    // obtener lista de garantais con estsado retendida
    async findRetenidas(cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `
            SELECT 
                c.id as contrato_id, 
                p.nombre as propiedad_nombre, 
                l.nombre_local as local_nombre, 
                g.id as garantia_id, 
                g.monto as garantia
            FROM contrato c
            JOIN local l ON c.local_id = l.id
            JOIN garantia g ON g.contrato_id = c.id
            JOIN propiedad p ON l.propiedad_id = p.id
            JOIN estado_garantia eg ON g.estado_id = eg.id
            WHERE eg.estado = 'retenida' and c.estado_id = (SELECT id FROM estado_contrato WHERE estado = 'activo')
            `
        );
        return result.rows;
    }

    //obtener garantia detallada
    async findDetallada(garantiaId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `
            SELECT 
                c.id as contrato_id,
                i.nombre as inquilino_nombre,
                p.nombre as propiedad_nombre,
                l.nombre_local as local_nombre,
                g.id as garantia_id,
                g.monto as garantia,
                g.fecha_registro,
                g.observaciones as garantia_observaciones
            FROM garantia g
            JOIN contrato c ON g.contrato_id = c.id
            JOIN inquilino i ON c.inquilino_id = i.id
            JOIN local l ON c.local_id = l.id
            JOIN propiedad p ON l.propiedad_id = p.id
            WHERE g.id = $1
            `,
            [garantiaId]
        );
        return result.rows[0];
    }
}
