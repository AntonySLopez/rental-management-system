import poolClient from "../../../infrastructure/postgres.js";
import type { ContratoInput } from "../interface/types/contrato.types.js";
import type { PoolClient } from "pg";

export class ContratoRepository {

    // registrarContrato - según B8
    async registrarContrato(contrato: ContratoInput, poolClient: PoolClient): Promise<number> {
        console.log(contrato);
        
        const values = [
            contrato.inquilino_id,
            contrato.local_id,
            contrato.precio_mensual,
            contrato.garantia,
            contrato.lectura_inicial_luz,
            contrato.fecha_inicio,
            contrato.duracion_meses,
            contrato.observaciones ?? 'sin observaciones',
            contrato.metodo_pago,
            contrato.referencia ?? 'sin referencia',
        ];

        if (contrato.observaciones) {
            values[7] = contrato.observaciones;
        }

        if(contrato.metodo_pago !== 'efectivo') {
            values[8] = contrato.metodo_pago;
        }

        if(contrato.referencia) {
            values[9] = contrato.referencia;
        }

        const query = `
            INSERT INTO contrato (
                inquilino_id,
                local_id,
                precio_mensual,
                garantia,
                lectura_inicial_luz,
                fecha_inicio,
                duracion_meses,
                observaciones,
                metodo_pago,
                referencia
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id;
            `;
        const result = await poolClient.query(query, values);
        return result.rows[0].id;
    }

    // registrarNuevaGarantia - según B8
    async registrarNuevaGarantia(
        contratoId: number, 
        monto: number, 
        poolClient: PoolClient): Promise<void> {
        await poolClient.query(`
            INSERT INTO garantia (
                contrato_id,
                monto
            )
            VALUES ($1, $2)
        `, [contratoId, monto]);
    }

    // crearCuotasDeAlquiler - según B8
    async crearCuotasDeAlquiler(
        contratoId: number, 
        fechaInicio: string, 
        duracionmeses: number, 
        precioMensual: number, 
        poolClient: PoolClient): Promise<number> {
        // Generar cuotas mensuales entre fecha_inicio y fecha_fin por x meses
        const result = await poolClient.query(`
            Select fn_generar_cuotas_alquiler($1, $2, $3, $4) AS ids
            `, [contratoId, fechaInicio, duracionmeses, precioMensual]);
        // retornamos el primer ID de las cuotas generadas
        const firstId = result.rows[0].ids[0];
        return firstId;
    }

    // registrarPagoAlquiler - según B8
    async registrarPagoAlquiler(
        cuotaAlquilerId: number, 
        monto: number, 
        metodoPago: string, 
        poolClient: PoolClient): Promise<void> {
        await poolClient.query(`
            SELECT fn_registrar_primer_pago($1, $2, $3)
            `, [cuotaAlquilerId, metodoPago, monto]
        );
    }

    // actualizarEstadoLocal - según B8
    async actualizarEstadoLocal(
        localId: number, 
        poolClient: PoolClient): Promise<void> {
        await poolClient.query(
            `UPDATE local SET estado = 'ocupado' WHERE id = $1`,
            [localId]
        );
    }

    // listarContratos - según B8
    async listarContratos(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const result = await poolClient.query(
            `SELECT 
                c.id, 
                i.nombre as inquilino, 
                l.nombre as local, 
                c.precio_mensual, 
                c.fecha_inicio, 
                c.duracion_meses,
                c.estado
             FROM contrato c
             JOIN inquilino i ON c.inquilino_id = i.id
             JOIN local l ON c.local_id = l.id
             ORDER BY c.id
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const totalResult = await poolClient.query('SELECT COUNT(*) FROM contrato');
        const total = parseInt(totalResult.rows[0].count);
        return {
            data: result.rows,
            total,
            page,
            limit
        };
    }

    // obtenerContrato - según B8
    async obtenerContrato(id: number) {
        const result = await poolClient.query(`
            SELECT 
                c.id, 
                c.precio_mensual, 
                c.garantia, 
                c.lectura_inicial_luz, 
                c.fecha_creacion, 
                c.fecha_inicio, 
                c.duracion_meses,
                c.observaciones, 
                c.estado,
                i.id as inquilino_id, 
                i.nombre as inquilino_nombre, 
                i.documento as inquilino_documento,
                l.id as local_id, 
                l.nombre as local_nombre, 
                l.area as local_area
             FROM contrato c
             JOIN inquilino i ON c.inquilino_id = i.id
             JOIN local l ON c.local_id = l.id
             WHERE c.id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    }

    // obtenerCuotasAdeudadas - según B8
    async obtenerCuotasAdeudadas(contratoId: number) {
        const result = await poolClient.query(
            `SELECT COALESCE(SUM(monto), 0) as total
             FROM cuota_alquiler
             WHERE contrato_id = $1 AND estado IN ('activo', 'atrasado')`,
            [contratoId]
        );
        return parseFloat(result.rows[0].total) || 0;
    }

    // obtenerConsumoAdeudado - según B8
    async obtenerConsumoAdeudado(contratoId: number) {
        const result = await poolClient.query(
            `SELECT COALESCE(SUM(monto), 0) as total
             FROM consumo_luz
             WHERE contrato_id = $1 AND estado = 'pendiente'`,
            [contratoId]
        );
        return parseFloat(result.rows[0].total);
    }

    // actualizarContratoInquilino - según B8
    async actualizarContratoInquilino(contratoId: number, inquilinoId: number): Promise<void> {
        await poolClient.query(
            `UPDATE contrato SET inquilino_id = $1 WHERE id = $2`,
            [inquilinoId, contratoId]
        );
    }

    // actualizarContrato - según B8
    async actualizarContratoLocal(
        contratoId: number, 
        localId: number, 
        poolClient: PoolClient,
        observaciones?: string 
    ): Promise<void> {
        const query = observaciones
            ? `UPDATE contrato SET local_id = $1, observaciones = $2 WHERE id = $3`
            : `UPDATE contrato SET local_id = $1 WHERE id = $2`;
        
        const params = observaciones
            ? [localId, observaciones, contratoId]
            : [localId, contratoId];
        
        await poolClient.query(query, params);
    }

    // alternarDisponibilidadLocal - según B8
    // Marca el nuevo local como ocupado y libera el anterior
    async alternarDisponibilidadLocal(
        contratoId: number, 
        nuevoLocalId: number,
        poolClient:PoolClient
    ): Promise<void> {
        // Obtener el local_id actual del contrato
        const result = await poolClient.query(
            `SELECT local_id FROM contrato WHERE id = $1`,
            [contratoId]
        );
        const localIdActual = result.rows[0]?.local_id;
        console.log(localIdActual);
        
        // Liberar el local anterior (si existe y es diferente)
        if (localIdActual && localIdActual !== nuevoLocalId) {
            await poolClient.query(
                `UPDATE local SET estado = 'libre' WHERE id = $1`,
                [localIdActual]
            );
        }

        // Marcar el nuevo local como ocupado
        await poolClient.query(
            `UPDATE local SET estado = 'ocupado' WHERE id = $1`,
            [nuevoLocalId]
        );
    }

    // actualizarContratoObservaciones - según B8
    async actualizarContratoObservaciones(
        contratoId: number,
        poolClient:PoolClient,
        observaciones?: string
    ): Promise<void> {
        const query = observaciones
            ? `UPDATE contrato SET observaciones = $1 WHERE id = $2`
            : `UPDATE contrato SET observaciones = NULL WHERE id = $1`;
        
        const params = observaciones
            ? [observaciones, contratoId]
            : [contratoId];
        
        await poolClient.query(query, params);
    }

    // cerrarContrato - según B8
    // Cambia el estado del contrato a 'cerrado'
    async cerrarContrato(contratoId: number, poolClient:PoolClient): Promise<void> {
        await poolClient.query(
            `UPDATE contrato SET estado = 'cerrado' WHERE id = $1`,
            [contratoId]
        );
    }

    // liberarEstadoLocal - según B8
    // Marca el local como libre
    async liberarEstadoLocal(contratoId: number, poolClient:PoolClient): Promise<void> {
        // Obtener el local_id del contrato
        const result = await poolClient.query(
            `SELECT local_id FROM contrato WHERE id = $1`,
            [contratoId]
        );
        const localId = result.rows[0]?.local_id;

        // Marcar el local como libre
        if (localId) {
            await poolClient.query(
                `UPDATE local SET estado = 'libre' WHERE id = $1`,
                [localId]
            );
        }
    }

    // extraerGarantiaByid - según B8
    // Retira el saldo restante de la garantía del contrato
    async extraerGarantiaByid(contratoId: number, poolClient: PoolClient): Promise<number> {
        const result = await poolClient.query(
            `SELECT monto FROM garantia WHERE contrato_id = $1`,
            [contratoId]
        );
        const monto = result.rows[0]?.monto || 0;
        
        // Eliminar la garantía
        await poolClient.query(
            `DELETE FROM garantia WHERE contrato_id = $1`,
            [contratoId]
        );
        
        return monto;
    }

    // renovarContrato - según B8
    // Cambia el estado del contrato a 'renovado'
    async renovarContrato(contratoId: number, poolClient: PoolClient): Promise<void> {
        await poolClient.query(
            `UPDATE contrato SET estado = 'renovado' WHERE id = $1`,
            [contratoId]
        );
    }

    // obtenerDatosContrato - para renovación
    // Obtiene todos los datos del contrato para reutilizar en la renovación
    async obtenerDatosContrato(contratoId: number, poolClient: PoolClient) {
        const result = await poolClient.query(
            `SELECT 
            inquilino_id, 
            local_id, 
            precio_mensual, 
            lectura_inicial_luz, 
            duracion_meses, 
            metodo_pago, 
            referencia
             FROM contrato WHERE id = $1`,
            [contratoId]
        );
        return result.rows[0];
    }

}
