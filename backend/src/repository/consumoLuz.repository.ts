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

    // busca el ultimo registro de consumo de luz por contrato id
    async findLastByContratoId(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `SELECT lectura_actual, fecha_fin FROM consumo_luz WHERE contrato_id = $1 ORDER BY id DESC LIMIT 1`,
            [contratoId]
        );  
        return result.rows[0];
    }

    // guardar consumo de luz sobre el id del ultimo registro
    async saveConsumo(consumo: Luz, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `INSERT INTO consumo_luz (contrato_id, fecha_inicio, fecha_fin, lectura_anterior, lectura_actual, precio_kwh, alumbrado_publico, consumo_total, monto, estado_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (SELECT id FROM estado_deuda WHERE estado = 'pendiente')) 
            RETURNING *`,
            [consumo.contrato_id, consumo.fecha_inicio, consumo.fecha_fin, consumo.lectura_anterior, consumo.lectura_actual, consumo.precio_kwh, consumo.alumbrado_publico, consumo.consumo_total, consumo.monto]
        );
        return result.rows[0];
    }

    // guardar nuevo consumo de luz
    async saveNewConsumoLuz (consumo: Luz, cliente?: PoolClient){

        const result = await (cliente ?? pool).query(
            `INSERT INTO consumo_luz (contrato_id, fecha_inicio, fecha_fin, lectura_anterior, lectura_actual, precio_kwh, alumbrado_publico, consumo_total, estado_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM estado_deuda WHERE estado = 'pendiente')) 
            RETURNING *`,
            [consumo.contrato_id, consumo.fecha_inicio, consumo.fecha_fin, consumo.lectura_anterior, consumo.lectura_actual, consumo.precio_kwh, consumo.alumbrado_publico, consumo.consumo_total]
        );
        return result.rows[0];
    }

    // listar todos los consumos de luz por contrato
    async findAllByContratoId(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `select cl.fecha_inicio, cl.lectura_actual, cl.monto, cl.monto_pagado, ed.estado from consumo_luz cl join estado_deuda ed on cl.estado_id = ed.id where ed.estado != 'pagado' and cl.contrato_id = $1`,
            [contratoId]
        );
        return result.rows;
    }
    
    // listar todos los consumos de luz pendientes por contrato
    async findPendientesByContrato(contratoId: number, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `select cl.id, cl.fecha_inicio, cl.monto, cl.monto_pagado, ed.estado from consumo_luz cl join estado_deuda ed on cl.estado_id = ed.id where ed.estado != 'pagado' and cl.contrato_id = $1 ORDER BY cl.fecha_inicio ASC`,
            [contratoId]
        );
        return result.rows.map(row => ({
            ...row,
            monto: Number(row.monto),
            monto_pagado: Number(row.monto_pagado),
            type: "consumo_luz"
        }));
    }

    // actualizar consumo de luz
    async updateConsumo(id:number, monto_pagado:number,estado: string, cliente?: PoolClient) {
        const result = await (cliente ?? pool).query(
            `UPDATE consumo_luz SET monto_pagado = $1, estado_id = (SELECT id FROM estado_deuda WHERE estado = $2) WHERE id = $3 RETURNING *`,
            [monto_pagado, estado, id]
        );
        return result.rows[0];
    }
};
