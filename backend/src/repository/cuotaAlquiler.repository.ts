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

    async findAllByContratoId(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `select ca.fecha_inicio, ca.monto, ca.monto_pagado, ed.estado from cuota_alquiler ca join estado_deuda ed on ca.estado_id = ed.id where ed.estado != 'pagado' and ca.contrato_id = $1`,
            [contratoId]
        );
        return result.rows;
    }
    // listar todas las cuotas pendientes por contrato
     async findPendientesByContrato(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query
        (`select ca.id, ca.fecha_inicio, ca.monto, ca.monto_pagado, ed.estado from cuota_alquiler ca join estado_deuda ed on ca.estado_id = ed.id where ed.estado != 'pagado' and ca.contrato_id = $1 ORDER BY ca.fecha_inicio ASC`, [contratoId]);
        return result.rows.map(row => ({
            ...row,
            monto: Number(row.monto),
            monto_pagado: Number(row.monto_pagado),
            type: "cuota_alquiler"
        }));
    }

    // actualizar cuota de alquiler
    async updateCuota(id:number, monto_pagado:number,estado: string, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `UPDATE cuota_alquiler SET monto_pagado = $1, estado_id = (SELECT id FROM estado_deuda WHERE estado = $2) WHERE id = $3 RETURNING *`,
            [monto_pagado, estado, id]
        );
        return result.rows[0];
    }
}
