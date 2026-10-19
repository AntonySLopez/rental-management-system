import pool from "../infrastructure/postgres.js";

export class SharedRepository {
    async contarRegistros(tabla: string, filtros?: { columna: string, valor: any }): Promise<number> {
        // 1. Lista blanca para evitar que inyecten tablas maliciosas
        const tablasPermitidas = ['local', 'inquilino', 'contrato'];
        if (!tablasPermitidas.includes(tabla)) {
            throw new Error('Tabla no permitida para conteo.');
        }

        let query = `SELECT COUNT(id) AS items FROM ${tabla}`;
        const params: any[] = [];

        // 2. futuro para agregar filtros dinámicos (ej: estado = 'activo')
        if (filtros) {
            query += ` WHERE ${filtros.columna} = $1`;
            params.push(filtros.valor);
        }

        const result = await pool.query(query, params);
        return Number(result.rows[0].items);
    }
}