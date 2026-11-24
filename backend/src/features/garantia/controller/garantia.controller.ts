import type { Request, Response } from "express";
import { GarantiaService } from "../service/garantia.service.js";
import { detalleGarantiaSchema } from "../interface/dto/detalleGarantia.dto.js";
import { listarMovimientosGarantiaSchema } from "../interface/dto/listarMovimientosGarantia.dto.js";
import { nuevoMovimientoGarantiaSchema } from "../interface/dto/nuevoMovimientoGarantia.dto.js";

const garantiaService = new GarantiaService();

export class GarantiaController {

    /**
     * Obtener garantía por contrato
     * GET /garantias/:contrato_id
     */
    detalleGarantia = async (req: Request, res: Response) => {
        // 1. Validar params
        const contratoId = Number(req.params.contrato_id);
        const dto = detalleGarantiaSchema.parse({ contrato_id: contratoId });
        console.log(`Detalle de garantia del contrato: ${dto.contrato_id}`);
        
        
        // 2. Delegar al service
        const result = await garantiaService.detalleGarantia(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Listar movimientos de garantía
     * GET /garantias/:contrato_id/movimientos
     */
    listarMovimientosGarantia = async (req: Request, res: Response) => {
        // 1. Validar params y query
        const contratoId = Number(req.params.contrato_id);
        const page = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;
        const dto = listarMovimientosGarantiaSchema.parse({
            contrato_id: contratoId,
            page: page,
            limit: limit
        });
        
        // 2. Delegar al service
        const result = await garantiaService.listarMovimientosGarantia(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Registrar movimiento de garantía
     * POST /garantias/:contrato_id/movimientos
     */
    nuevoMovimientoGarantia = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const contratoId = Number(req.params.contrato_id);
        const dto = nuevoMovimientoGarantiaSchema.parse({
            ...req.body,
            contrato_id: contratoId
        });
        
        // 2. Delegar al service
        const result = await garantiaService.nuevoMovimientoGarantia(dto);
        
        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    }
}
