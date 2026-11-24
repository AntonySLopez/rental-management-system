import type { Request, Response } from "express";
import { ContratoService } from "../service/contrato.service.js";
import { nuevoContratoSchema } from "../interface/dto/nuevoContrato.dto.js";
import { listarContratosSchema } from "../interface/dto/listarContratos.dto.js";
import { detalleContratoSchema } from "../interface/dto/detalleContrato.dto.js";
import { actualizarContratoSchema } from "../interface/dto/actualizarContrato.dto.js";
import { cerrarContratoSchema } from "../interface/dto/cerrarContrato.dto.js";
import { renovarContratoSchema } from "../interface/dto/renovarContrato.dto.js";

const contratoService = new ContratoService();

export class ContratoController {

    /**
     * Crear nuevo contrato
     * POST /contratos
     */
    nuevoContrato = async (req: Request, res: Response) => {
        // 1. Validar forma del DTO
        const contrato = nuevoContratoSchema.parse(req.body);
        
        // 2. Delegar al service
        const result = await contratoService.nuevoContrato(contrato);
        
        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    }

    /**
     * Listar contratos con paginación
     * GET /contratos
     */
    listarContratos = async (req: Request, res: Response) => {
        // 1. Validar query params
        const dto = listarContratosSchema.parse(req.query);
        
        // 2. Delegar al service
        const result = await contratoService.listarContratos(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Obtener detalle de contrato
     * GET /contratos/:id
     */
    detalleContrato = async (req: Request, res: Response) => {
        // 1. Validar params
        const dto = detalleContratoSchema.parse(req.params);
        
        // 2. Delegar al service
        const result = await contratoService.detalleContrato(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Actualizar contrato
     * PATCH /contratos/:id
     */
    actualizarContrato = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const id = parseInt(req.params.id as string);
        const dto = actualizarContratoSchema.parse(req.body);
        
        // 2. Delegar al service
        const result = await contratoService.actualizarContrato(id, dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Cerrar contrato
     * PATCH /contratos/:id/cerrar
     */
    cerrarContrato = async (req: Request, res: Response) => {
        // 1. Validar params
        const dto = cerrarContratoSchema.parse(req.params);
        
        // 2. Delegar al service
        const result = await contratoService.cerrarContrato(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Renovar contrato
     * PATCH /contratos/:id/renovar
     */
    renovarContrato = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const id = parseInt(req.params.id as string);
        const dto = renovarContratoSchema.parse(req.body);
        
        // 2. Delegar al service
        const result = await contratoService.renovarContrato(id, dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }
}
