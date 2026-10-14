import type { Request, Response } from "express";
import { InquilinoService } from "../service/inquilino.service.js";
import { nuevoInquilinoSchema } from "../interface/dto/registrarInquilino.dto.js";
import { listarInquilinosSchema } from "../interface/dto/listarInquilinos.dto.js";
import { detalleInquilinoSchema } from "../interface/dto/detalleInquilino.dto.js";
import { actualizarInquilinoSchema } from "../interface/dto/actualizarInquilino.dto.js";

const inquilinoService = new InquilinoService();

export class InquilinoController {

    /**
     * Registrar nuevo inquilino
     * POST /inquilinos
     */
    registrarInquilino = async (req: Request, res: Response) => {
        // 1. Validar forma del DTO
        const inquilino = nuevoInquilinoSchema.parse(req.body);
        
        // 2. Delegar al service
        const result = await inquilinoService.registrarInquilino(inquilino);
        
        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    }

    /**
     * Listar inquilinos con paginación
     * GET /inquilinos
     */
    listarInquilinos = async (req: Request, res: Response) => {
        // 1. Validar query params
        const dto = listarInquilinosSchema.parse(req.query);
        
        // 2. Delegar al service
        const result = await inquilinoService.listarInquilinos(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Obtener inquilino por id
     * GET /inquilinos/:id
     */
    detalleInquilino = async (req: Request, res: Response) => {
        // 1. Validar params
        const dto = detalleInquilinoSchema.parse(req.params);
        
        // 2. Delegar al service
        const result = await inquilinoService.detalleInquilino(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Actualizar inquilino
     * PATCH /inquilinos/:id
     */
    actualizarInquilino = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const dto = actualizarInquilinoSchema.parse({ ...req.params, ...req.body });
        
        // 2. Delegar al service
        const result = await inquilinoService.actualizarInquilino(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }
}
