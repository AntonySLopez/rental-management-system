import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { Garantia } from "../types/garantia.types.js";

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
}
