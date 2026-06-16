import { ContratoRepository } from "../repository/contrato.repository.js";
import { CuotaAlquilerRepository } from "../repository/cuotaAlquiler.repository.js";
import { ConsumoLuzRepository } from "../repository/consumoLuz.repository.js";
import { movimientoRepository } from "../repository/movimiento.repository.js";
import { AplicacionPagoRepository } from "../repository/aplicacionPago.repository.js";
import type { PagosPendientes } from "../types/registrarPago.types.js";
import type { Movimiento } from "../types/movimiento.types.js";
import type { RegistrarPagoDTO } from "../schema/RegistrarPagoDTO.js";

import pool from "../config/postgres.js"
import type { PoolClient } from "pg";
import { AppError } from "../middleWare/flujo/appError.middleware.js";
import { number } from "zod";

export class PagoService {
    private contratoRepository: ContratoRepository;
    private cuotaAlquilerRepository: CuotaAlquilerRepository;
    private consumoLuzRepository: ConsumoLuzRepository;
    private movimientoRepository: movimientoRepository
    private aplicacionPagoRepository: AplicacionPagoRepository

    constructor() {
        this.contratoRepository = new ContratoRepository();
        this.cuotaAlquilerRepository = new CuotaAlquilerRepository();
        this.consumoLuzRepository = new ConsumoLuzRepository();
        this.movimientoRepository = new movimientoRepository()
        this.aplicacionPagoRepository = new AplicacionPagoRepository()
    }

    async registrarPago(pago: RegistrarPagoDTO) {
        // obtenemos cliente de la base de datos
        const cliente: PoolClient = await pool.connect();
        console.log("hilo de conexion obtenido");
        try {
            // Validar contrato existente 
            await this.validarContratoExistente(pago.contratoId);
            // iniciamos transaccion
            await cliente.query('BEGIN');
            // obtener deudas del contrato
            const deudas = await this.obtenerDeudasDelContrato(pago.contratoId, cliente);
            // registrar movimiento de pago
            const movimiento = await this.registrarMovimientoPago(pago, cliente);
            // generar orden de pago
            const orderPay = this.generarOrdenDePago(deudas as { cuotas: PagosPendientes<'cuota_alquiler'>[], consumos: PagosPendientes<'consumo_luz'>[] }, pago.monto);
            // aplicar pago detallado
            await this.aplicarPagoDetallado(orderPay, movimiento.id, cliente);
            // confirmar transaccion
            await cliente.query('COMMIT');
            return { message: "Pago registrado correctamente" };

        } catch (error) {
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            // liberamos cliente
            cliente.release();
            console.log("hilo de conexion liberado");
        }
        
    }

    // validar contrato existente
    private async validarContratoExistente(contratoId: number) {
        const contratoExistente = await this.contratoRepository.findById(contratoId);
        if (!contratoExistente || contratoExistente.estado !== "activo") {
            throw new AppError("El contrato no existe o no está activo", 404);
        }
    };

    // obtener deudas del contrato
    private async obtenerDeudasDelContrato(contratoId: number, cliente:PoolClient) {
        // Obtener cuotas de alquiler pendientes
        const cuotasPendientes: PagosPendientes<'cuota_alquiler'>[] = await this.cuotaAlquilerRepository.findPendientesByContrato(contratoId, cliente);
        console.log("cuotasPendientes", cuotasPendientes);
        
        // Obtener consumos de luz pendientes
        const consumosPendientes: PagosPendientes<'consumo_luz'>[] = await this.consumoLuzRepository.findPendientesByContrato(contratoId, cliente);
        console.log("consumosPendientes", consumosPendientes);
        
        return {
            cuotas: cuotasPendientes,
            consumos: consumosPendientes
        };
    };

    // registrar movimiento de pago
    private async registrarMovimientoPago(pago: RegistrarPagoDTO, cliente:PoolClient) {
        const movimiento: Movimiento = {
            contrato_id: pago.contratoId,
            fecha: new Date(),
            monto: pago.monto,
            metodo_pago: pago.metodoPago,
            referencia: pago.referencia || "sin referencia",
            descripcion: pago.descripcion || "sin descripcion"
        };
        
        const result = await this.movimientoRepository.saveMovimiento(movimiento, cliente)
        console.log("movimiento registrado", result);
        return result;
    };

    // generar orden de pago
    private generarOrdenDePago(deudas: { cuotas: PagosPendientes<'cuota_alquiler'>[], consumos: PagosPendientes<'consumo_luz'>[] }, saldo: number) {
        const deuda: PagosPendientes<'cuota_alquiler' | 'consumo_luz'>[] = [...deudas.cuotas, ...deudas.consumos];
        const deudaOrdenada: PagosPendientes<'cuota_alquiler' | 'consumo_luz'>[] = deuda.sort((a, b) => a.fecha_inicio.getTime() - b.fecha_inicio.getTime());

        let saldoDisponible = saldo;
        let orderPay: PagosPendientes<'cuota_alquiler' | 'consumo_luz'>[] = [];
        let i = 0;
        // implementa logica para aplicar monto de pago por deuda
        while (saldoDisponible > 0 && deudaOrdenada.length > 0) {
            // obtenermos monto y restamos al monto_pagado y agregamos monto_to_pay
            const montoAPagar = deudaOrdenada[i]!.monto- deudaOrdenada[i]!.monto_pagado;
            if(montoAPagar >= saldoDisponible){
                deudaOrdenada[i]!.monto_pagado = deudaOrdenada[i]!.monto_pagado + saldoDisponible;
                deudaOrdenada[i]!.to_pay = saldoDisponible;
                deudaOrdenada[i]!.estado = saldoDisponible === deudaOrdenada[i]!.monto ? 'pagado' : 'parcial';
                saldoDisponible = 0;
            }else{
                deudaOrdenada[i]!.monto_pagado = deudaOrdenada[i]!.monto_pagado + montoAPagar;
                deudaOrdenada[i]!.to_pay = montoAPagar;
                deudaOrdenada[i]!.estado = 'pagado';
                saldoDisponible -= montoAPagar;
            }
            orderPay.push(deudaOrdenada[i]!);
            i++;
        }
        console.log("lista de orden concretada", orderPay);
        
        return orderPay;
    };

    // aplica pagos detallado por sector
    private async aplicarPagoDetallado(orderPay: PagosPendientes<'cuota_alquiler' | 'consumo_luz'>[], movimientoId:number, cliente:PoolClient){
        console.log("primer elemento", orderPay[0]);
        for (const pago of orderPay) {
            if( pago.type === 'cuota_alquiler') {
                // aplicar pago a alquiler
                await this.aplicacionPagoRepository.savePagoAlquiler({
                    movimiento_id: movimientoId,
                    cuota_alquiler_id: pago.id,
                    monto_aplicado: pago.monto_pagado,
                    fecha_aplicacion: new Date()
                }, cliente);
                await this.cuotaAlquilerRepository.updateCuota(pago.id, pago.monto_pagado, pago.estado, cliente);
                console.log("aplicando pago a alquiler", pago.monto_pagado);
            }else if( pago.type === 'consumo_luz') {
                // aplicar pago a luz
                await this.aplicacionPagoRepository.savePagoLuz({
                    movimiento_id: movimientoId,
                    consumo_luz_id: pago.id,
                    monto_aplicado: pago.monto_pagado,
                    fecha_aplicacion: new Date()
                }, cliente);
                await this.consumoLuzRepository.updateConsumo(pago.id, pago.monto_pagado, pago.estado, cliente);
                console.log("aplicando pago a luz", pago.monto_pagado);
            }
        }
        console.log("transaccion confirmada"); 
    }
}


