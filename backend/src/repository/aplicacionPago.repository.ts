import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { AplicacionPagoAlquiler, AplicacionPagoLuz } from "../types/aplicacionPago.types.js";

export class AplicacionPagoRepository {
    // guarda pago de alquiler
    async savePagoAlquiler(pago: AplicacionPagoAlquiler, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `INSERT INTO aplicacion_pago_alquiler (movimiento_id, cuota_alquiler_id, monto_aplicado, fecha_aplicacion) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [pago.movimiento_id, pago.cuota_alquiler_id, pago.monto_aplicado, pago.fecha_aplicacion]
        );
        return result.rows[0];
    }

    // guarda pago de luz
    async savePagoLuz(pago: AplicacionPagoLuz, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `INSERT INTO aplicacion_pago_luz (movimiento_id, consumo_luz_id, monto_aplicado, fecha_aplicacion) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [pago.movimiento_id, pago.consumo_luz_id, pago.monto_aplicado, pago.fecha_aplicacion]
        );
        return result.rows[0];
    }
}