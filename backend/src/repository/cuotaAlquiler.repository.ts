import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { Cuota } from "../types/cuota.types.js";

export class CuotaAlquilerRepository {
    
    // guarda todas las cuotas para un contrato
    async saveAllCuotasForContrato(cuota: Cuota, cantidad: number, cliente?: PoolClient) {

        // obtenemos un canal para asegurar la insercion de todas las cuotas en la base de datos
        const client = await (cliente ?? pool.connect());
        // funcion que inserta una query de cuota individual agregando una nueva fecha de inicio, fin y vencimiento
        function insertaCuota(cuota: Cuota, indice: number) {
            const fechaInicio = new Date(cuota.fecha_inicio)
            fechaInicio.setMonth(fechaInicio.getMonth() + indice)
            
            const fechaFin = new Date(fechaInicio)
            fechaFin.setMonth(fechaFin.getMonth() + 1)
            fechaFin.setDate(0) // último día del mes
            
            return client.query(
                `INSERT INTO cuota_alquiler (contrato_id, fecha_inicio, fecha_fin, monto, estado_id) 
                VALUES ($1, $2, $3, $4, (SELECT id FROM estado_deuda WHERE estado = 'pendiente')) 
                RETURNING *`,
                [cuota.contrato_id, fechaInicio, fechaFin, cuota.monto]
            );
        };

        try {
        // usamos BEGIN para iniciar una transacción en el nuevo canal client
            await client.query('BEGIN');
            for (let i = 0; i < cantidad; i++) {
                await insertaCuota(cuota, i);
            }
            await client.query('COMMIT');
            return cuota;
        } catch (error) {
            // usamos ROLLBACK para revertir la transacción en caso de error
            await client.query('ROLLBACK');
            throw error;
        }
    }
}
