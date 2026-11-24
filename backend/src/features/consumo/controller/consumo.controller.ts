import type { Request, Response } from "express";
import { ConsumoService } from "../service/consumo.service.js";
import { nuevoConsumoSchema } from "../interface/dto/nuevoConsumo.dto.js";
import { listarConsumosSchema } from "../interface/dto/listarConsumos.dto.js";
import { detalleConsumoSchema } from "../interface/dto/detalleConsumo.dto.js";
import { nuevoPagoConsumoSchema } from "../interface/dto/nuevoPagoConsumo.dto.js";

const consumoService = new ConsumoService();

export class ConsumoController {

    /**
     * nuevoConsumo - Caso de uso #21
     * POST /consumo/:contrato_id/registrar
     */
    nuevoConsumo = async (req: Request, res: Response) => {
        // 1. Validar params y body con Zod
        const contratoId = Number(req.params.contrato_id);
        const dto = nuevoConsumoSchema.parse({
            ...req.body,
            contrato_id: contratoId
        });

        // 2. Delegar al service
        const result = await consumoService.nuevoConsumo(dto);

        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    };

    /**
     * listarConsumos - Caso de uso #22
     * GET /consumo/:contrato_id/
     */
    listarConsumos = async (req: Request, res: Response) => {
        // 1. Validar params con Zod
        const contratoId = Number(req.params.contrato_id);
        const dto = listarConsumosSchema.parse({ contrato_id: contratoId });

        // 2. Delegar al service
        const result = await consumoService.listarConsumos(dto);

        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    };

    /**
     * detalleConsumo - Caso de uso #23
     * GET /consumo/:contrato_id/detalle/:id
     */
    detalleConsumo = async (req: Request, res: Response) => {
        // 1. Validar params con Zod
        const contratoId = Number(req.params.contrato_id);
        const consumoId = Number(req.params.id);
        const dto = detalleConsumoSchema.parse({
            contrato_id: contratoId,
            id: consumoId
        });

        // 2. Delegar al service
        const result = await consumoService.detalleConsumo(dto);

        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    };

    /**
     * nuevoPagoConsumo - Caso de uso #24
     * POST /consumo/:contrato_id/pagar/:id
     */
    nuevoPagoConsumo = async (req: Request, res: Response) => {
        // 1. Validar params y body con Zod
        const contratoId = Number(req.params.contrato_id);
        const consumoId = Number(req.params.id);
        const dto = nuevoPagoConsumoSchema.parse({
            ...req.body,
            contrato_id: contratoId,
            id: consumoId
        });

        // 2. Delegar al service
        const result = await consumoService.nuevoPagoConsumo(dto);

        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    };
}
