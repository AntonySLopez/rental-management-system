import pool from "../../../../infrastructure/postgres.js";
import { ConsumoRepository } from "../../repository/consumo.repository.js";
import type { NuevoConsumoDto } from "../../interface/dto/nuevoConsumo.dto.js";
import type { 
    NuevoConsumoResponse, 
    ConsumoInput, 
    ListarConsumosResponse,
    DetalleConsumoResponse,
    NuevoPagoConsumoResponse 
} from "../../interface/types/consumo.types.js";

/**
 * ConsumoLogic
 * Lógica de negocio y cálculos para Consumo
 */
export class ConsumoLogic {
    private consumoRepository: ConsumoRepository;

    constructor(consumoRepository: ConsumoRepository) {
        this.consumoRepository = consumoRepository;
    }

    /**
     * operation24 - registrarConsumo
     * Calcula consumo_kwh_total y monto, y registra el consumo en BD
     */
    async operation24(dto: NuevoConsumoDto): Promise<NuevoConsumoResponse> {
        const consumoKwhTotal = dto.lectura_actual - dto.lectura_anterior;
        const alumbrado = dto.alumbrado_publico ?? 0;
        const montoCalculado = Number(((consumoKwhTotal * dto.precio_kwh) + alumbrado).toFixed(2));

        const consumoInput: ConsumoInput = {
            contrato_id: dto.contrato_id,
            fecha_inicio: dto.fecha_inicio,
            fecha_fin: dto.fecha_fin,
            lectura_anterior: dto.lectura_anterior,
            lectura_actual: dto.lectura_actual,
            precio_kwh: dto.precio_kwh,
            alumbrado_publico: alumbrado,
            monto: montoCalculado
        };

        const result = await this.consumoRepository.registrarConsumo(consumoInput);

        return {
            id: result.id.toString()
        };
    }

    /**
     * operation25 - listarConsumos
     * Extrae todos los registros de consumo de luz del contrato
     */
    async operation25(contratoId: number): Promise<ListarConsumosResponse> {
        const consumos = await this.consumoRepository.listarConsumos(contratoId);

        return {
            data: consumos.map((row: any) => ({
                id: row.id,
                fecha_inicio: row.fecha_inicio.toISOString().split('T')[0],
                fecha_fin: row.fecha_fin.toISOString().split('T')[0],
                consumo_kwh_total: Number(row.consumo_kwh_total),
                monto: Number(row.monto),
                estado: row.estado
            }))
        };
    }

    /**
     * operation26 - detalleConsumo
     * Consulta todos los datos del consumo de luz y su pago registrado si existe
     */
    async operation26(consumoId: number): Promise<DetalleConsumoResponse> {
        const consumo = await this.consumoRepository.obtenerConsumoById(consumoId);
        const pago = await this.consumoRepository.obtenerPagoConsumo(consumoId);

        return {
            id: consumo.id,
            contrato_id: consumo.contrato_id,
            fecha_inicio: consumo.fecha_inicio.toISOString().split('T')[0],
            fecha_fin: consumo.fecha_fin.toISOString().split('T')[0],
            lectura_anterior: Number(consumo.lectura_anterior),
            lectura_actual: Number(consumo.lectura_actual),
            consumo_kwh_total: Number(consumo.consumo_kwh_total),
            precio_kwh: Number(consumo.precio_kwh),
            alumbrado_publico: Number(consumo.alumbrado_publico),
            monto: Number(consumo.monto),
            estado: consumo.estado,
            pago: pago ? {
                id: pago.id,
                monto: Number(pago.monto),
                metodo_pago: pago.metodo_pago,
                referencia: pago.referencia,
                fecha_registro: pago.fecha_registro.toISOString().split('T')[0],
                observaciones: pago.observaciones
            } : null
        };
    }

    /**
     * operation27 - registrarPagoConsumo
     * Registra el pago en pago_consumo y actualiza el estado de consumo_luz a 'pagado' con transacción
     */
    async operation27(
        consumoId: number,
        monto: number,
        metodoPago: string,
        referencia: string | null,
        observaciones: string | null
    ): Promise<NuevoPagoConsumoResponse> {
        const poolClient = await pool.connect();

        try {
            await poolClient.query('BEGIN');

            // registrarPagoConsumo.repository()
            const pago = await this.consumoRepository.registrarPagoConsumo(
                consumoId,
                monto,
                metodoPago,
                referencia,
                observaciones,
                poolClient
            );

            // actualizarConsumo.repository()
            await this.consumoRepository.actualizarConsumo(consumoId, poolClient);

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
