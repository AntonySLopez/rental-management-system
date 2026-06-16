import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { Movimiento } from "../types/movimiento.types.js";

export class movimientoRepository {
    
    async saveMovimiento(movimiento: Movimiento, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `INSERT INTO movimiento (contrato_id, fecha, monto, metodo_pago_id, referencia, descripcion) 
            VALUES ($1, $2, $3, (select id from metodo_pago where metodo = $4), $5, $6) 
            RETURNING *`,
            [movimiento.contrato_id, movimiento.fecha, movimiento.monto, movimiento.metodo_pago, movimiento.referencia, movimiento.descripcion]
        );
        return result.rows[0];
    }
}