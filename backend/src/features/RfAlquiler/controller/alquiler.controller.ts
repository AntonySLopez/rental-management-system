import type { Request, Response } from "express";
import { AlquilerService } from "../service/alquiler.service.js";
import { listarCuotasSchema } from "../interface/dto/listarCuotas.dto.js";
import { detalleCuotaSchema } from "../interface/dto/detalleCuota.dto.js";
import { nuevoPagoAlquilerSchema } from "../interface/dto/nuevoPagoAlquiler.dto.js";

const alquilerService = new AlquilerService();

export class AlquilerController {

    /**
     * listarCuotas - Caso de uso #18
     * GET /alquiler/:contrato_id/cuotas
     */
    listarCuotas = async (req: Request, res: Response) => {
        // 1. Validar params
        const contratoId = Number(req.params.contrato_id);
        const dto = listarCuotasSchema.parse({ contrato_id: contratoId });
        
        // 2. Delegar al service
        const result = await alquilerService.listarCuotas(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * detalleCuota - Caso de uso #19
     * GET /alquiler/:contrato_id/cuotas/:id
     */
    detalleCuota = async (req: Request, res: Response) => {
        // 1. Validar params
        const contratoId = Number(req.params.contrato_id);
        const cuotaId = Number(req.params.id);
        const dto = detalleCuotaSchema.parse({ contrato_id: contratoId, cuota_id: cuotaId });
        
        // 2. Delegar al service
        const result = await alquilerService.detalleCuota(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * nuevoPagoAlquiler - Caso de uso #20
     * POST /alquiler/:contrato_id/cuotas/:id/pagos
     */
    nuevoPagoAlquiler = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const contratoId = Number(req.params.contrato_id);
        const cuotaId = Number(req.params.id);
        const dto = nuevoPagoAlquilerSchema.parse({
            ...req.body,
            contrato_id: contratoId,
            cuota_id: cuotaId
        });
        
        // 2. Delegar al service
        const result = await alquilerService.nuevoPagoAlquiler(dto);
        
        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    }
}
