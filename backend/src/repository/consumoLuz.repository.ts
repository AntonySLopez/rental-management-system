import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { Luz } from "../types/luz.types.js";

export class ConsumoLuzRepository {
  
    // guarda el primer registro de consumo de luz
    async saveFirstConsumoLuz(consumo: Luz, cliente?: PoolClient) {
        
        const fechaFin = new Date(consumo.fecha_fin);
        fechaFin.setDate(fechaFin.getDate() + 1);

        const result = await (cliente ?? pool).query(
            `INSERT INTO consumo_luz (contrato_id, fecha_inicio, fecha_fin, lectura_anterior, lectura_actual, precio_kwh, alumbrado_publico, consumo_total, estado_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM estado_deuda WHERE estado = 'pendiente')) 
            RETURNING *`,
            [consumo.contrato_id, consumo.fecha_inicio, fechaFin, consumo.lectura_anterior, consumo.lectura_actual, consumo.precio_kwh, consumo.alumbrado_publico, consumo.consumo_total]
        );
        return result.rows[0];
    }
};
