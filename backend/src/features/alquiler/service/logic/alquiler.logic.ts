import { AlquilerRepository } from "../../repository/alquiler.repository.js";
import type { ListarCuotasResponse } from "../../interface/types/alquiler.types.js";
import type { PagoAlquilerResponse } from "../../interface/types/alquiler.types.js";
import type { NuevoPagoAlquilerResponse } from "../../interface/types/alquiler.types.js";
import pool from "../../../../infrastructure/postgres.js";

/**
 * AlquilerLogic
 * Clase que agrupa todas las operaciones de lógica de negocio para alquiler
 */
export class AlquilerLogic {
    private alquilerRepository: AlquilerRepository;

    constructor(alquilerRepository: AlquilerRepository) {
        this.alquilerRepository = alquilerRepository;
    }

    /**
     * operation21 - listarCuotas
     * Extrae todas las cuotas del contrato recibido, incluidas las anuladas
     */
    async operation21(contratoId: number): Promise<ListarCuotasResponse> {
        // listarCuotas.repository()
        const cuotas = await this.alquilerRepository.listarCuotas(contratoId);
        
        return {
            data: cuotas.map((row: any) => ({
                id: row.id.toString(),
                fecha_inicio: row.fecha_inicio,
                fecha_vencimiento: row.fecha_vencimiento,
                monto: Number(row.monto),
                estado: row.estado
            }))
        };
    }

    /**
     * operation22 - obtenerPagoAlquiler
     * Obtiene información del pago registrado sobre la cuota_id
     */
    async operation22(cuotaId: number): Promise<PagoAlquilerResponse> {
        // obtenerPagoAlquiler.repository()
        const pago = await this.alquilerRepository.obtenerPagoAlquiler(cuotaId);
        
        return {
            id: pago.id.toString(),
            monto: Number(pago.monto),
            metodo_pago: pago.metodo_pago,
            referencia: pago.referencia,
            fecha_registro: pago.fecha_registro.toISOString(),
            observaciones: pago.observaciones
        };
    }

    /**
     * operation23 - registrarPagoAlquiler
     * Registra el pago y actualiza estado de cuota con transacción
     */
    async operation23(
        cuotaId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        observaciones: string | null
    ): Promise<NuevoPagoAlquilerResponse> {
        const poolClient = await pool.connect();
        
        try {
            await poolClient.query('BEGIN');
            
            // registrarPagoAlquiler.repository()
            const pago = await this.alquilerRepository.registrarPagoAlquiler(
                cuotaId,
                monto,
                metodoPago,
                referencia,
                observaciones,
                poolClient
            );
            
            // actualizarCuota.repository()
            await this.alquilerRepository.actualizarCuota(cuotaId, poolClient);
            
            await poolClient.query('COMMIT');
            
            return {
                id: pago.id.toString()
            };
        } catch (error) {
            await poolClient.query('ROLLBACK');
            throw error;
        } finally {
            poolClient.release();
        }
    }
}
