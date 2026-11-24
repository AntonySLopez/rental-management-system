import type { Request, Response } from "express";
import { LocalService } from "../service/local.service.js";
import { nuevoLocalSchema } from "../interface/dto/registrarLocal.dto.js";
import { listarLocalesSchema } from "../interface/dto/listarLocales.dto.js";
import { detalleLocalSchema } from "../interface/dto/detalleLocal.dto.js";
import { actualizarLocalSchema } from "../interface/dto/actualizarLocal.dto.js";

const localService = new LocalService();

export class LocalController {

    /**
     * Registrar nuevo local
     * POST /locales
     */
    registrarLocal = async (req: Request, res: Response) => {
        // 1. Validar forma del DTO
        const local = nuevoLocalSchema.parse(req.body);
        console.log('radar1');
        
        // 2. Delegar al service
        const result = await localService.registrarLocal(local);
        
        // 3. Retornar respuesta según B7
        res.status(201).json(result);
    }

    /**
     * Listar locales con paginación
     * GET /locales
     */
    listarLocales = async (req: Request, res: Response) => {
        // 1. Validar query params
        const dto = listarLocalesSchema.parse(req.query);
        
        // 2. Delegar al service
        const result = await localService.listarLocales(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Obtener detalle de local
     * GET /locales/:id
     */
    detalleLocal = async (req: Request, res: Response) => {
        // 1. Validar params
        const dto = detalleLocalSchema.parse(req.params);
        
        // 2. Delegar al service
        const result = await localService.detalleLocal(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }

    /**
     * Actualizar local
     * PATCH /locales/:id
     */
    actualizarLocal = async (req: Request, res: Response) => {
        // 1. Validar params y body
        const dto = actualizarLocalSchema.parse({ ...req.params, ...req.body });
        
        // 2. Delegar al service
        const result = await localService.actualizarLocal(dto);
        
        // 3. Retornar respuesta según B7
        res.status(200).json(result);
    }
}
